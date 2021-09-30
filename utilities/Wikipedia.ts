import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import * as Type from '@Type/Utilities'
import * as Bluebird from 'bluebird'
import Axios, { AxiosInstance } from 'axios'

const sentry = Sentry.Context

const logger = Logger.Context

const transaction = sentry.startTransaction({
  name: 'Wikipedia',
  op: 'Utilities/Wikipedia',
  description: 'It should handle wikipedia search from oficial api.',
})

const Meta = () => ({
  search: async (request: AxiosInstance, search: string) => {
    const suggestions = []
    const response: Type.WikipediaSearchResponse = {
      searchTerm: '',
      suggestions: [],
    }

    try {
      const searchResponse = await request.get<Type.WikipediaSearchAxios>('/', {
        params: {
          action: 'opensearch',
          search: search,
          limit: 5,
          namespace: 0,
          format: 'json',
        },
      })

      /**
       * It organizes in a data structure the possible contents
       * to be used coming from wikipedia itself, this structure
       * can be iterated through a readline.
       */
      searchResponse.data[1].forEach((title: string, index: number) => {
        suggestions.push({
          title,
          generic: searchResponse.data[2][index],
          link: searchResponse.data[3][index],
        })
      })

      response.searchTerm = search
      response.data = searchResponse.data
      response.suggestions = suggestions

      if (!searchResponse.data[1].includes(search))
        throw new Error("[Wikipedia] 🔴 Search term don't return any results!")
      return response
    } catch (error) {
      logger.error(error) // todo: remove it from this context
      sentry.captureException(error)
    } finally {
      transaction.finish()
    }
  },
  content: async (
    request: AxiosInstance,
    search: Type.WikipediaSearchSuggestions
  ) => {
    // todo: it can break if wikipedia domain has change from https://**.wikipedia.org/
    const route = search.link.substr(24, search.link.length)
    const content: Type.WikipediaResponse = {
      pageid: 0,
      title: '',
      url: '',
      links: [],
      content: '',
      summary: '',
      references: [],
      images: [],
    }

    try {
      const { data } = await request.get(route, {
        params: {
          action: 'query',
          prop: 'extracts|images|links|info|extlinks',
          redirects: 1,
          exsectionformat: 'wiki',
          explaintext: true,
          titles: search.title,
          format: 'json',
        },
      })

      /**
       * It obtains the raw data received directly by the request
       * from the official wikipedia api and transforms this
       * request into an iterable object.
       */
      const wrapper = Object.entries<Type.WikipediaContentResponse>(
        data.query.pages
      )
      const pages = new Map(wrapper)

      /**
       * Assemble the data structure referring to the type
       * 'WikipediaResponse' giving a structure very similar
       * to what algorithmia already does.
       */
      await Bluebird.map(pages, async ([, value]) => {
        content.pageid = value.pageid
        content.title = value.title
        content.url = search.link
        content.links = value.links.map((item) => item.title)
        content.content = value.extract
        content.summary = value.extract.split('\n\n\n')[0]
        content.references = value.extlinks.map((item) => item['*'])
        content.images = await Bluebird.map(value.images, async (value) => {
          const { data } = await request.get('/', {
            params: {
              action: 'query',
              prop: 'imageinfo',
              titles: value.title,
              format: 'json',
              iiprop: 'url',
            },
          })

          const wrapper = Object.entries<Type.WikipediaImageResponse>(
            data.query.pages
          )
          const images = new Map(wrapper)

          return new Promise((resolve) => {
            images.forEach((image) =>
              image.imageinfo.forEach((item) => resolve(item.url))
            )
          })
        })
      })

      /**
       * Returns the data structure similar to the wiki-parser
       * algorithmia, with the difference that it is now
       * directly accessed by the wikipedia api.
       */
      return content
    } catch (error) {
      logger.error(error)
      sentry.captureException(error)
    } finally {
      transaction.finish()
    }
  },
})

const Wrapper = () => ({
  request: async (
    { searchTerm: search, lang }: Type.WikipediaRequest,
    switcher: Type.WikipediaSwitcher
  ) => {
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
    const { suggestions } = await meta.search(wikipedia, search)

    return await meta.content(wikipedia, suggestions[switcher()])
  },
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all wikipedia functions.
 */
export const Context = Wrapper()
