import { GluegunCommand, GluegunToolbox } from 'gluegun'
import * as Main from '@App/Main'

const command: GluegunCommand<GluegunToolbox> = {
  name: 'search',
  alias: ['s'],
  description: 'Search for the desired term by the selected engine.',
  run: async (toolbox) => {
    Main.Application(async ({ application }) => {
      /**
       * Object responsible for maintaining temporary
       * settings for searches and terms initially
       * conditioned to Wikipedia.
       */
      const localContent = {
        maximumSentences: 7,
        search: '',
        prefix: '',
      }

      /**
       * Prompts and inputs that will be handled and
       * transformed into user initial settings.
       */
      const search = await application.readline.question('Type a search term: ')

      const selectedIndex = await toolbox.prompt.ask({
        type: 'select',
        name: 'term',
        message: 'Choose one option',
        choices: ['Who is', 'What is', 'The history of'],
      })

      localContent.search = search
      localContent.prefix = selectedIndex.term

      // Statefull
      application.state.save(localContent)
    })
  },
}

/**
 * the module should be exported by default
 * for everything to work smoothly.
 */
export default { ...command }
