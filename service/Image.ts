import * as Main from '@App/Main'
import * as Type from '@Type/Global'

const Service = () => ({
  image: () =>
    Main.Application(async ({ ctx, application }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Image Service',
        op: 'Service/Image',
        description: 'Service to handle with google images.',
      })

      const content: Type.RuleState = application.state.load()

      const SearchEngineContent = async (
        item: Type.StateSentence,
        query: string
      ) => {
        const image = await application.google.searchEngine(query)
        item.images = image.data.items.map((item) => item.link)
        item.googleSearchQuery = query
      }

      // Initialize
      ctx.logger.info('[Service/Image] 🚀 Initialize image service...')

      try {
        ctx.logger.info('[Service/Image] 🔵 Try to get images from google!')

        await Promise.all(
          content.sentences.map(async (item, index) => {
            const defaultQuery = content.searchTerm
            const query = content.searchTerm.concat(item.keywords[0])

            /**
             * Try to add links and image queries
             * to the project's content.
             */
            if (index == 0) await SearchEngineContent(item, defaultQuery)
            else await SearchEngineContent(item, query)
          })
        )

        ctx.logger.success('[Service/Image] 🟢 Images from google passed!')

        // State
        application.state.save(content)
      } catch (error) {
        ctx.logger.error('[Service/Text] 🔴 '.concat(error))
        ctx.sentry.captureException(error)
      } finally {
        transaction.finish()
      }
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all image functions.
 */
export const Context = Service()
