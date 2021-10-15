import * as Child from 'child_process'
import * as FileSystem from 'fs'
import * as Prompts from 'prompts'
import * as Chalk from 'chalk'
import Axios from 'axios'

const Meta = () => ({
  updateFileCreate: async () => {
    if (!FileSystem.existsSync('temp/update.json')) {
      /**
       * Gets the data from the package.json file
       * and stores the data in a variable that
       * will be used to create the update file.
       */
      const nodePackage = FileSystem.readFileSync('package.json').toString()
      const configuration = JSON.parse(nodePackage)

      /**
       * Create the update file and store
       * it in a temporary folder within the
       * project itself.
       */
      const updateObj = Object.defineProperty({}, 'config', {
        enumerable: true,
        configurable: true,
        writable: false,
        value: {
          appName: configuration.name,
          version: configuration.version,
        },
      })

      FileSystem.writeFileSync(
        'temp/update.json',
        JSON.stringify(updateObj, null, 2)
      )
    }
  },
})

const Container = () => ({
  update: async () => {
    const meta = Meta()

    /**
     * Gets the data from the package.json file
     * and stores the data in a variable that
     * will be used to create the update file.
     */
    await meta.updateFileCreate()

    /**
     * Makes a request to the project's
     * package.json file that is public as
     * @juniorbotelho's repository.
     */
    const gitPackage = Axios.create({
      baseURL: 'https://raw.githubusercontent.com/juniorbotelho/',
      timeout: 30000,
    })

    const remote = await gitPackage.get('videomaker-core/main/package.json')

    const localUpdateFile = JSON.parse(
      FileSystem.readFileSync('temp/update.json').toString()
    )

    const needsUpdate = remote.data.version.split('.').map((version, idx) => {
      const remoteVersion = Number.parseInt(version)
      const localVersion = Number.parseInt(
        localUpdateFile.config.version.split('.')[idx]
      )
      if (localVersion < remoteVersion) return 'OK'
    })

    if (needsUpdate.includes('OK')) {
      console.clear()
      const update = await Prompts.prompts.text({
        type: 'text',
        name: 'update',
        message: '🥤 '.concat(
          Chalk.green('An update is available, do you want to update? [Y/N]')
        ),
      })

      if (update.toUpperCase().includes('Y')) {
        Child.execSync('git pull origin main')
        FileSystem.unlinkSync('temp/update.json')
        await meta.updateFileCreate()
      } else {
        console.clear()
        console.error('❌ Update to the latest version to use project.')
        process.exit(400)
      }
    }
  },
})
/**
 * Returns an instance of the function
 * responsible for checking and updating
 * files based on github.
 */
export const Context = Container()
