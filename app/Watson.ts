import * as WatsonNatural from 'ibm-watson/natural-language-understanding/v1'
import * as Authenticator from 'ibm-watson/auth'
import * as Environment from '@App/Environment'

const NaturalClient = new WatsonNatural({
  authenticator: new Authenticator.IamAuthenticator({
    apikey: Environment.ENV.Watson().apikey,
  }),
  version: '2019-07-12',
})

export const Context = NaturalClient
