import Axios from 'axios'
import * as FileSystem from 'fs'
import * as Path from 'path'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import * as Type from '@Type/Global'

const transaction = Sentry.Context.startTransaction({
  name: 'Downloader Utils',
  op: 'Utilities/Downloader',
  description: 'Get download from specified links and images getters.',
})

const Wrapper = () => ({
  image: async ({ url, directory }: Type.ImageDownloader) => {
    const path = Path.resolve(directory)
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
