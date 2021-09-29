import * as Gluegun from 'gluegun'
import * as Main from '@App/Main'
import * as Type from '@Type/Global'

const Service = () => ({
  input: (toolbox: Gluegun.GluegunToolbox, fnCallback) =>
    Main.Application(async ({ ctx, application }) => {
      /**
       * Applies sentry support via CLI, to gather
       * information about possible errors in this context.
       */
      const transaction = ctx.sentry.startTransaction({
        name: 'Input Command Service',
        op: 'Service/Input',
        description: 'Get survey data via user input.',
      })

      // Initialize
      ctx.logger.info('[Service/Input] 🚀 Initialize input service...')

      try {
        /**
         * Object responsible for maintaining temporary
         * settings for searches and terms initially
         * conditioned to Wikipedia.
         */
        const localContent: Type.StateRules = {
          maximumSentences: 7,
          searchTerm: '',
          prefix: '',
        }

        /**
         * Prompts and inputs that will be handled and
         * transformed into user initial settings.
         */
        const search = await application.readline.question(
          '🔎 Type a search engine term: '
        )

        const selectedIndex = await toolbox.prompt.ask({
          type: 'select',
          name: 'term',
          message: 'Choose one option',
          choices: ['Who is', 'What is', 'The history of'],
        })

        localContent.searchTerm = search
        localContent.prefix = selectedIndex.term

        // Statefull
        application.state.save(localContent)

        await fnCallback()
      } catch (error) {
        toolbox.print.error(error)
        ctx.logger.error('[Service/Input] 🔴 '.concat(error))
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
