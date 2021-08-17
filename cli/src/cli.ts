import { GluegunToolbox, build } from 'gluegun'
import { Options } from 'gluegun/build/types/domain/options'

declare type CLIToolbox = (
  rawCommand?: string | Options,
  extraOptions?: Options
) => Promise<GluegunToolbox>

/**
 * Create an initial gluegun command
 * line executable, the cli and kick it off
 */
export async function run(argv: CLIToolbox): Promise<GluegunToolbox> {
  const cli = build()
    .brand('cli')
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
