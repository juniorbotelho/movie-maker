import * as Gluegun from 'gluegun'
import * as Main from '@App/Main'
import * as Type from '@Cli/types'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Commander'))

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
      run: () => {
        Main.Application(async ({ service, toolbox }) => {
          await toolbox.updater.update()

          /**
           * Main services are initializing here, all this
           * options are available from 'service module'.
           */
          await service.input(async () => {
            await service.text(async () => {
              await service.image(async () => {
                await service.slideshow()
              })
            })
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
