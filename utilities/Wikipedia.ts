import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import Axios, { AxiosInstance } from 'axios'

export type WikipediaRequest = {
  search: string
  lang: 'en' | 'es' | 'pt' | string
}

export type WikipediaSearchResponse = [string, string[], string[], string[]]

const sentry = Sentry.Context

const logger = Logger.Context

const transaction = sentry.startTransaction({
  name: 'Wikipedia',
  op: 'Utilities/Wikipedia',
  description: 'It should handle wikipedia search from oficial api.',
})

const Meta = () => ({
  search: async (request: AxiosInstance, search: string) => {
    try {
      const searchResponse = await request.get<WikipediaSearchResponse>('/', {
        params: {
          action: 'opensearch',
          search: search,
          limit: 5,
          namespace: 0,
          format: 'json',
        },
      })

      if (!searchResponse.data[1].includes(search))
        throw new Error("[Wikipedia] 🔴 Search term don't return any results!")
      return searchResponse
    } catch (error) {
      logger.error(error) // todo: remove it from this context
      sentry.captureException(error)
    } finally {
      transaction.finish()
    }
  },
})

const Wrapper = () => ({
  request: async ({ search, lang }: WikipediaRequest) => {
    const wikipedia = Axios.create({
      baseURL: 'https://'.concat(lang).concat('.wikipedia.org/w/api.php'),
      timeout: 30000,
    })

    const meta = Meta()

    /**
     * It obtains searches referring to the searched
     * term, as well as informing all the links
     * which should have some search for images
     * and contents.
     */
    const { data } = await meta.search(wikipedia, search)
  },
})

Wrapper().request({
  search: 'Michael Jackson',
  lang: 'en',
})
