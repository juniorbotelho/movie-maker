import * as Gluegun from 'gluegun'
import * as Main from '@App/Main'
import * as Type from '@Cli/types'

/**
 * Create an initial gluegun command
 * line executable, the cli and kick it off.
 */
export async function run(
  argv: Type.CommandArgs
): Promise<Gluegun.GluegunToolbox> {
  const cli = Gluegun.build()
    .brand('videomaker')
    .src(__dirname)
    .plugins('../node_modules', {
      matching: 'videomaker-*',
      hidden: true,
      required: false,
    })
    .defaultCommand({
      name: 'start',
      alias: ['s'],
      description: 'Search for the desired term by the selected engine.',
      run: (toolbox: Gluegun.GluegunToolbox) => {
        Main.Application(({ service }) => {
          service.input(toolbox, async () => {
            await service.text()
            await service.image()
          })
        })
      },
    })
    .help()
    .version()
    .create()

  const toolbox = await cli.run(argv)

  return toolbox
}
