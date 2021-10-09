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

      try {
        const slide = application.powerpoint.addSlide({
          masterName: 'MASTER_SLIDE',
        })

        slide.addShape('squareTabs', {
          align: 'center',
          w: '100%',
          h: '100%',
        })

        slide.addText('Hello World!', {
          fontFace: 'Abadi',
          fontSize: 32,
          align: 'center',
          x: 0,
          y: 0.52,
          w: '100%',
          h: '10%',
        })

        await application.powerpoint.writeFile({
          fileName: 'temp/presentation.pptx',
          compression: false,
        })

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

Context.slideshow()
