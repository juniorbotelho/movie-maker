import * as Google from '@App/Google'
import * as Environment from '@App/Environment'

const Wrapper = () => ({
  searchEngine: (
    query: string,
    options = {
      searchType: 'image',
      num: 2,
    }
  ) =>
    Google.Context.customsearch('v1').cse.list({
      auth: Environment.ENV.Google().apiKey,
      cx: Environment.ENV.Google().searchEngineId,
      q: query,
      searchType: options.searchType,
      num: options.num,
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all readline functions.
 */
export const Context = Wrapper()
