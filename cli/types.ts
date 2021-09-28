import { GluegunToolbox as ContextToolbox } from 'gluegun'
import { Options } from 'gluegun/build/types/domain/options'

// export types
export default {}

export type CommandArgs = (
  rawCommand?: string | Options,
  extraOptions?: Options
) => Promise<ContextToolbox>
