import { GluegunCommand, GluegunToolbox } from 'gluegun'

const command: GluegunCommand<GluegunToolbox> = {
  name: 'start',
  alias: ['s'],
  description: 'Responsible for initiating the interaction process',
  run: async (toolbox) => {
    toolbox.print.info('Welcome to your CLI')
  },
}

/**
 * the module should be exported by default
 * for everything to work smoothly.
 */
export default { ...command }
