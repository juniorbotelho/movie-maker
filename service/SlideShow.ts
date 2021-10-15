import * as Main from '@App/Main'

// TODO: remember to create this service using videoshow package
const Service = () => ({
  slideshow: () =>
    Main.Application(async ({ ctx, application }) => {
      /**
       * Defines Sentry as the service responsible for
       * handling exceptions caused by N factors. All errors
       * can be identified in the sentry.io dashboard.
       */
      const transaction = ctx.sentry.startTransaction({
        name: 'Slideshow',
        op: 'Service/Slideshow',
        description: 'Service to handle with slideshow as powerpoint module.',
      })

      const content = application.state.load()

      try {
        /**
         *
         */
        content.sentences.forEach((sentence) => {
          const slide = application.powerpoint.addSlide({
            masterName: 'MASTER_SLIDE',
          })

          slide.addText(sentence.text, {
            fontFace: 'Abadi',
            fontSize: 24,
            color: 'ffffff',
            align: 'left',
            x: 2.5,
            y: 5.25,
            w: '50%',
            h: '20%',
          })
        })

        await application.powerpoint.writeFile({
          fileName: 'temp/presentation.pptx',
          compression: false,
        })

        ctx.logger.info('Slideshow has created!')
        process.exit()
      } catch (error) {
        ctx.logger.error(error)
        ctx.sentry.captureException(error)
      } finally {
        transaction.finish()
      }
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all videoshow functions.
 */
export const Context = Service()
