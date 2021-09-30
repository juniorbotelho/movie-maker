import Axios, { AxiosInstance } from 'axios'

export type WikipediaRequest = {
  search: string
  lang: 'en' | 'es' | 'pt' | string
}

const Meta = () => ({
  search: async (request: AxiosInstance, search: string) => {
    return await request.get('/', {
      params: {
        action: 'opensearch',
        search: search,
        limit: 5,
        namespace: 0,
        format: 'json',
      },
    })
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
