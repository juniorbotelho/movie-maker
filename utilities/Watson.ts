import * as Watson from '@App/Watson'
import * as Environment from '@App/Environment'

import * as NLU from 'ibm-watson/natural-language-understanding/v1'
import * as LTD from 'ibm-watson/language-translator/v3'

const Wrapper = () => ({
  nlu: () =>
    new NLU({
      authenticator: Watson.Context.nluAuth,
      version: '2019-07-12',
      serviceUrl: Environment.ENV.Watson().nlu['url'],
    }),
  ltd: () =>
    new LTD({
      authenticator: Watson.Context.ldtAuth,
      version: '2018-05-01',
      serviceUrl: Environment.ENV.Watson().ltd['url'],
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all watson functions.
 */
export const Context = Wrapper()
