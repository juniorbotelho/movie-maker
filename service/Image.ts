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

      const logger = ctx.logger({})

      const SearchEngineContent = async (
        item: Type.StateSentence,
        query: string
      ) => {
        const image = await application.google.searchEngine(query)
        item.images = image.data.items.map((item) => item.link)
        item.googleSearchQuery = query
      }

      try {
        await Promise.all(
          content.sentences.map(async (item, index) => {
            const defaultQuery = content.searchTerm
            const query = content.searchTerm.concat(item.keywords[0])

            /**
             * Try to add links and image queries
             * to the project's content.
             */
            if (index == 0) SearchEngineContent(item, defaultQuery)
            else SearchEngineContent(item, query)
          })
        )

        // State
        application.state.save(content)
      } catch (error) {
        logger.error(error)
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
