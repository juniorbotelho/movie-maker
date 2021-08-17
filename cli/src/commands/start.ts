import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'start',
  alias: ['s'],
  run: async (toolbox) => {
    toolbox.print.info('Welcome to your CLI')
  },
}

/**
 * the module should be exported by default
 * for everything to work smoothly.
 */
export default { ...command }
