import { build, GluegunToolbox as ContextToolbox } from 'gluegun'
import { Options } from 'gluegun/build/types/domain/options'

declare type CommandArgs = (
  rawCommand?: string | Options,
  extraOptions?: Options
) => Promise<ContextToolbox>

/**
 * Create an initial gluegun command
 * line executable, the cli and kick it off
 */
export async function run(argv: CommandArgs): Promise<ContextToolbox> {
  const cli = build()
    .brand('videomaker')
    .src(__dirname)
    .plugins('../node_modules', {
      matching: 'videomaker-*',
      hidden: true,
      required: false,
    })
    .help()
    .version()
    .create()

  const toolbox = await cli.run(argv)

  return toolbox
}
