import * as Bluebird from 'bluebird'
import * as Main from '@App/Main'
import * as Type from '@Type/Global'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Image'))

const Service = () => ({
  image: () =>
    Main.Application(async ({ ctx, application }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Image Service',
        op: 'Service/Image',
        description: 'Service to handle with google images.',
      })

      const content: Type.StateRules = application.state.load()

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

        content.downloadedImages = []

        application.state.save(content)

        await Bluebird.map(content.sentences, async (item, index) => {
          const defaultQuery = content.searchTerm
          const query = content.searchTerm.concat(' ').concat(item.keywords[0])

          /**
           * Try to add links and image queries
           * to the project's content.
           */
          if (index == 0) await SearchEngineContent(item, defaultQuery)
          else await SearchEngineContent(item, query)

          /**
           * Here begins the logic for automated
           * image downloading.
           */
          await Bluebird.map(item.images, async (imageUrl, idx) => {
            try {
              if (content.downloadedImages.includes(imageUrl))
                throw new Error('The image has already been downloaded')

              /**
               * Download the image from the server via the
               * informed URL and keep it saved in memory.
               */
              await application.downloader.image({
                url: imageUrl,
                directory: `temp/images/${index
                  .toString()
                  .concat('-original.png')}`,
              })

              content.downloadedImages.push(imageUrl)

              ctx.logger.success(
                `[Service/Image] 📦 -> Downloaded: ${imageUrl}`
              )
            } catch (error) {
              ctx.logger.error(error)
              ctx.sentry.captureException(error)
            } finally {
              transaction.finish()
            }
          })
        })

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
