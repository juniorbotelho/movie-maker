import * as Main from '@App/Main'

// TODO: remember to create this service using videoshow package
const Service = () => ({
  slideshow: () =>
    Main.Application(async ({ ctx, application }) => {
      const content = application.state.load()

      const transaction = ctx.sentry.startTransaction({
        name: 'Slideshow',
        op: 'Service/Slideshow',
        description: 'Service to handle with slideshow as powerpoint module.',
      })

      /**
       * Add user metadata to powerpoint project,
       * this data may or may not be personal.
       */
      application.powerpoint.author = 'Personal'
      application.powerpoint.company = 'Personal Company'
      application.powerpoint.revision = '15'
      application.powerpoint.subject = 'Slideshow Instagram'
      application.powerpoint.title = content.searchTerm

      /**
       * Configure the layout of the project in power point,
       * note that the example below defines that the
       * project should have similar proportions to the
       * instagram slides.
       */
      application.powerpoint.defineLayout({
        name: 'INSTAGRAM',
        width: 11.25,
        height: 11.25,
      })
      application.powerpoint.layout = 'INSTAGRAM'
      application.powerpoint.rtlMode = false

      try {
        application.powerpoint.defineSlideMaster({
          title: 'MASTER_SLIDE',
          margin: [0.25, 0.25, 0.25, 0.25],
          background: {
            path: 'temp/texture.jpg',
            transparency: 20,
          },
          objects: [
            {
              image: {
                path: 'temp/background.jpg',
                transparency: 40,
                w: '100%',
                h: '100%',
              },
            },
          ],
          slideNumber: {
            fontSize: 23.6,
            align: 'right',
            color: 'ffffff',
            w: '100%',
            h: 0.52,
            y: 10.54,
          },
        })

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
