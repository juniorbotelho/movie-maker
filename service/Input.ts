import * as Gluegun from 'gluegun'
import * as Main from '@App/Main'
import * as Type from '@Type/Global'

const Service = () => ({
  input: async (__toolbox__: Gluegun.GluegunToolbox, fnCallback) =>
    await Main.Application(async ({ ctx, application, toolbox, config }) => {
      /**
       * Applies sentry support via CLI, to gather
       * information about possible errors in this context.
       */
      const transaction = ctx.sentry.startTransaction({
        name: 'Input Command Service',
        op: 'Service/Input',
        description: 'Get survey data via user input.',
      })

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

      try {
        /**
         * Prompts and inputs that will be handled and
         * transformed into user initial settings.
         */
        const askSearch = {
          type: 'input',
          name: 'search',
          message: '🔎 Type a search engine term',
        }

        const askKeyword = {
          type: 'select',
          name: 'prefix',
          message: 'Choose one of available options',
          choices: ['Who is', 'What is', 'The history of'],
        }

        const { search, prefix } = await toolbox.prompt.ask([
          askSearch,
          askKeyword,
        ])

        const searchWith = {
          articleTerm: search,
          lang: 'en',
        }

        await config.wikiParser
          .includes('algorithmia|wikipedia')
          .is('wikipedia', async () => {
            const article = await ctx.wikipedia.request(
              searchWith,
              async (suggestions) => {
                const options = await toolbox.prompt.ask({
                  type: 'select',
                  name: 'searchTerm',
                  message: 'Choose one search term',
                  choices: suggestions.map((item) => item.title),
                })

                /**
                 * Compare the requested term with the previous
                 * terms added by the wikipedia api.
                 */
                const [optionSelectedIndex] = suggestions
                  .map((item, selectedIndexSearch) => {
                    if (item.title == options.searchTerm)
                      return selectedIndexSearch
                  })
                  .join('')
                  .split('')

                return Number.parseInt(optionSelectedIndex)
              }
            )

            /**
             * After returning the text content from wikipedia,
             * you need to save it as part of the state
             * content of the content.json file.
             */
            localContent.sourceContentOriginal = article.content
          })

        localContent.searchTerm = search
        localContent.prefix = prefix

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
