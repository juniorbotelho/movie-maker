import * as Watson from '@App/Watson'
import * as Environment from '@App/Environment'

import * as NLU from 'ibm-watson/natural-language-understanding/v1'
import * as PLI from 'ibm-watson/personality-insights/v3'

const Wrapper = () => ({
  nlu: () =>
    new NLU({
      authenticator: Watson.Context,
      version: '2019-07-12',
      serviceUrl: Environment.ENV.Watson().features['IBM_NLU_URL'],
    }),
  pli: () =>
    new PLI({
      authenticator: Watson.Context,
      version: '2016-10-19',
      serviceUrl: '',
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all watson functions.
 */
export const Context = Wrapper()
