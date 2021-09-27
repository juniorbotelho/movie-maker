import * as Environment from '@App/Environment'
import * as Authenticator from 'ibm-watson/auth'

const Watson = new Authenticator.IamAuthenticator({
  apikey: Environment.ENV.Watson().apikey,
})

export const Context = Watson
