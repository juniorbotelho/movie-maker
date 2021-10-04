import * as Environment from '@App/Environment'
import * as Authenticator from 'ibm-watson/auth'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Watson'))

const Wrapper = () => ({
  nluAuth: new Authenticator.IamAuthenticator({
    apikey: Environment.ENV.Watson().nlu.apikey,
  }),
  ldtAuth: new Authenticator.IamAuthenticator({
    apikey: Environment.ENV.Watson().ltd.apikey,
  }),
})

export const Context = Wrapper()
