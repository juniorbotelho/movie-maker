import * as Main from '@App/Main'
import { GluegunToolbox } from 'gluegun'

const Service = () => ({
  input: (toolbox: GluegunToolbox) =>
    Main.Application(async ({ ctx, application }) => {
      /**
       * Applies sentry support via CLI, to gather
       * information about possible errors in this context.
       */
      const transaction = ctx.sentry.startTransaction({
        name: 'Search CLI Command',
        op: 'Cli/Commands/Search',
        description: 'Get survey data via user input.',
      })

      try {
        /**
         * Object responsible for maintaining temporary
         * settings for searches and terms initially
         * conditioned to Wikipedia.
         */
        const localContent = {
          maximumSentences: 7,
          searchTerm: '',
          prefix: '',
        }

        /**
         * Prompts and inputs that will be handled and
         * transformed into user initial settings.
         */
        const search = await application.readline.question(
          'Type a search term: '
        )

        const selectedIndex = await toolbox.prompt.ask({
          type: 'select',
          name: 'term',
          message: 'Choose one option',
          choices: ['Who is', 'What is', 'The history of'],
        })

        localContent.searchTerm = search.toUpperCase()
        localContent.prefix = selectedIndex.term

        // Statefull
        application.state.save(localContent)
      } catch (error) {
        toolbox.print.error(error)
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
