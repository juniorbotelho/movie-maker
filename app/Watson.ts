import * as Environment from '@App/Environment'
import * as Authenticator from 'ibm-watson/auth'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Watson'))

const Watson = new Authenticator.IamAuthenticator({
  apikey: Environment.ENV.Watson().apikey,
})

export const Context = Watson
