import { GluegunToolbox } from 'gluegun'

/**
 * Extensions belonging to the 'start.command' CLI command
 * @param toolbox - Parameter with toolbox items
 */
const Ext = (toolbox: GluegunToolbox): void => {
  toolbox.foo = () => {
    toolbox.print.info('called foo extension')
  }
}

export default { Ext }
