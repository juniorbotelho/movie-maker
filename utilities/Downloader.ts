import Axios from 'axios'
import * as FileSystem from 'fs'
import * as Path from 'path'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import * as Type from '@Type/Global'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Downloader'))

const transaction = Sentry.Context.startTransaction({
  name: 'Downloader',
  op: 'Utilities/Downloader',
  description: 'Get download from specified links and images getters.',
})

const Wrapper = () => ({
  image: async ({ url, directory }: Type.ImageDownloader) => {
    const path = Path.resolve(directory)

    const mountPath = []

    /**
     * This iteration creates the necessary folders
     * for use if they do not exist, these folders
     * are for the imaging service.
     */
    path.split('/').map((sourcePath) => {
      if (sourcePath && !sourcePath.includes('.png')) {
        mountPath.push('/'.concat(sourcePath))
        if (!FileSystem.existsSync(mountPath.join('')))
          FileSystem.mkdirSync(mountPath.join(''))
      }
    })

    const writer = FileSystem.createWriteStream(path)

    try {
      const { data } = await Axios.get<FileSystem.ReadStream>(url, {
        method: 'get',
        responseType: 'stream',
      })

      data.pipe(writer)

      /**
       * The promise is an encapsulator of events that
       * should signal the end of the expected
       * download, whether successful or
       * unsuccessful.
       */
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    } catch (error) {
      Logger.Context.error(error)
      Sentry.Context.captureException(error)
    } finally {
      transaction.finish()
    }
  },
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all readline functions.
 */
export const Context = Wrapper()
