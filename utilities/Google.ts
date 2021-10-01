import * as Google from '@App/Google'
import * as Environment from '@App/Environment'

/**
 * Resolve to simulate the integrity of the software
 * making it to impersonate a browser of a real
 * user, this approach only changes the 'header'
 * of the call.
 */
Google.Context.options({
  headers: {
    authority: 'www.google.com',
    method: 'GET',
    scheme: 'https',
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    referer: 'https://www.google.com/',
    'sec-ch-ua':
      '"Chromium";v="94", ";Not A Brand";v="99", "Google Chrome";v="94.0.992.31"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': 1,
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
  },
})

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
