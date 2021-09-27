import * as Environment from '@App/Environment'

const Algorithmia = require('algorithmia')

const Client = Algorithmia.client(Environment.ENV.Algorithmia().apiKey)

export const Context = Client
