import { GluegunToolbox } from 'gluegun'

/**
 * Extensions belonging to the 'start.command' CLI command
 * @param toolbox - Parameter with toolbox items
 */
export default (toolbox: GluegunToolbox): void => {
  toolbox.foo = () => {
    toolbox.print.info('called foo extension')
  }
}
