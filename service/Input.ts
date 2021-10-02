import * as Main from '@App/Main'
import * as Type from '@Type/Global'
import * as UtilitieType from '@Type/Utilities'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Input'))

const Service = () => ({
  input: async (fnCallback) =>
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
        const search = await toolbox.prompts.text({
          type: 'text',
          name: 'search',
          message: '🔎 Type a search term',
        })

        const engine = await toolbox.prompts.select<string>({
          type: 'multiselect',
          name: 'engine',
          message: 'Choose one of available engines',
          choices: [
            { title: 'Wikipedia', value: 'wikipedia' },
            { title: 'Geekhunter', value: 'geekhunter' },
          ],
        })

        const searchWith = {
          articleTerm: search,
          lang: 'en',
        }

        if (['geekhunter'].includes(engine)) {
          await ctx.blog.search(
            search,
            engine,
            async (response: Type.SiteSearchResponse) => {
              const selectedOption =
                await toolbox.prompts.select<Type.SiteSearchResponse>({
                  type: 'multiselect',
                  name: 'selectedOption',
                  message: 'Choose one of available topics',
                  choices: response.posts.map((item) => ({
                    title: item.title,
                    value: item.link,
                  })),
                })

              console.log('selectedOption', selectedOption)
            }
          )
        } else {
          const prefix = await toolbox.prompts.select<string>({
            type: 'multiselect',
            name: 'prefix',
            message: 'Choose one of available options',
            choices: [
              { title: 'Who is', value: '#ff0000' },
              { title: 'What is', value: '#00ff00' },
              { title: 'The history of', value: '#0000ff' },
            ],
          })

          await config.wikiParser
            .includes('algorithmia|wikipedia')
            .is('wikipedia', async () => {
              const article = await ctx.wikipedia.request(
                searchWith,
                async (suggestions) => {
                  type Wiki = UtilitieType.WikipediaSearchSuggestions

                  /**
                   * Compare the requested term with the previous
                   * terms added by the wikipedia api.
                   */
                  return await toolbox.prompts.select<Wiki>({
                    type: 'multiselect',
                    name: 'searchTerm',
                    message: 'Choose one search term',
                    choices: suggestions.map((item) => ({
                      title: item.title,
                      value: item,
                    })),
                  })
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
        }

        // Statefull
        application.state.save(localContent)
        await fnCallback()
      } catch (error) {
        toolbox.native.print.error(error)
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
