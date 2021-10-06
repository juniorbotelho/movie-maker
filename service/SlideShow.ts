import * as Main from '@App/Main'

// TODO: remember to create this service using videoshow package
const Service = () => ({
  slideshow: () =>
    Main.Application(async ({ ctx, application }) => {
      const content = application.state.load()

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
        name: 'Instagram',
        width: 50.8,
        height: 50.8,
      })
      application.powerpoint.layout = 'Instagram'
      application.powerpoint.rtlMode = true
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all videoshow functions.
 */
export const Context = Service()
