import * as Main from '@App/Main'

const Service = () => ({
  text: () =>
    Main.Application(async ({ ctx, application }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Text Service',
        op: 'Service/Text',
        description: 'Get survey data via algorithmia.',
      })

      const content = application.state.load()

      try {
        /**
         * Responsible for returning the full wikipedia article
         * about the search term using the 'algorithmia' platform.
         */
        const article = await ctx.algorithmia
          .algo('web/WikipediaParser/0.1.2')
          .pipe({
            articleName: content.searchTerm,
            lang: 'en',
          })

        console.log(article.get())
      } catch (error) {
        ctx.logger({}).error(error)
        ctx.sentry.captureException(error)
      } finally {
        transaction.finish()
      }
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all readline functions.
 */
export const Context = Service()
