import * as Environment from '@App/Environment'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Algorithmia'))

const Algorithmia = require('algorithmia')

const Client = Algorithmia.client(Environment.ENV.Algorithmia().apiKey)

export const Context = Client
