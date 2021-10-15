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

      application.registry.loadFromFile('temp')

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

        const searchWith = {
          articleTerm: search,
          lang: 'en',
        }

        const engine = await toolbox.prompts.select<string>({
          type: 'multiselect',
          name: 'engine',
          message: 'Choose one of available engines',
          choices: [
            { title: 'Wikipedia', value: 'wikipedia' },
            { title: 'Algorithmia', value: 'algorithmia' },
            ...application.registry.listAll().map((item) => ({
              title: item.charAt(0).toUpperCase().concat(item.slice(1)),
              value: item,
            })),
          ],
        })

        /**
         * Just ask for language if selected engine
         * is wikipedia or algorithmia.
         */
        if (engine.includes('wikipedia') || engine.includes('algorithmia')) {
          searchWith.lang = await toolbox.prompts.select<string>({
            type: 'multiselect',
            name: 'language',
            message: 'Select your engine language',
            choices: [
              { title: 'English', value: 'en' },
              { title: 'Portuguese', value: 'pt' },
              { title: 'Spanish', value: 'es' },
            ],
          })
        }

        if (application.registry.listAll().includes(engine)) {
          /**
           * Search for the requested topic through a pre-created
           * template and add the result of that search in link
           * format to localContent.
           */
          await ctx.blog.search(
            search,
            engine,
            async (response: Type.SiteSearchResponse) => {
              localContent.customTopic = await toolbox.prompts.select<string>({
                type: 'multiselect',
                name: 'selectedOption',
                message: 'Choose one of available topics',
                choices: response.posts.map((item) => ({
                  title: item.title,
                  value: item.link,
                })),
              })
            }
          )

          /**
           * Based on the previous search, the 'localContent' state now
           * has the link where a request can be made to the template
           * via the 'request' method.
           */
          await ctx.blog.request(
            localContent.customTopic,
            engine,
            ({ content: ct, title, sentences }: Type.SiteSearchRequested) => {
              localContent.searchTerm = title
              localContent.sourceContentOriginal = sentences.join(' ')
              localContent.summary = ct.toplines.reduce((item) => item).text
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
