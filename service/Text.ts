import * as Main from '@App/Main'
import { RuleSave } from '@Type/Utilities'

const Service = () => ({
  text: () =>
    Main.Application(async ({ ctx, application }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Text Service',
        op: 'Service/Text',
        description: 'Get survey data via algorithmia.',
      })

      const content: RuleSave = application.state.load()

      const Sanitize = () => ({
        standardMarkdown: (text: RuleSave) =>
          text.sourceContentOriginal
            .split('\n')
            .filter((line) => {
              if (line.trim().length == 0 || line.trim().startsWith('='))
                return false
              return true
            })
            .join(' ')
            .replace(/\((?:\([^()]*\)|[^()])*\)/gm, '')
            .replace(/ {2}/g, ' '),
      })

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

        /**
         * After returning the text content from wikipedia,
         * you need to save it as part of the state
         * content of the content.json file.
         */
        content.sourceContentOriginal = article.get().content
        content.sourceContentSanitized = Sanitize().standardMarkdown(content)

        application.state.save(content)
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
