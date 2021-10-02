import * as Environment from '@App/Environment'
import * as Algorithmia from '@App/Algorithmia'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import * as Sequelize from '@App/Sequelize'
import * as WikiParser from '@Config/WikiParser'
import * as Wikipedia from '@Utilities/Wikipedia'
import * as ReadLine from '@Utilities/ReadLine'
import * as State from '@Utilities/State'
import * as Sentence from '@Utilities/Sentence'
import * as Watson from '@Utilities/Watson'
import * as Google from '@Utilities/Google'
import * as Downloader from '@Utilities/Downloader'
import * as Lexical from '@Utilities/Lexical'
import * as Gluegun from '@Utilities/Gluegun'
import * as Input from '@Service/Input'
import * as Text from '@Service/Text'
import * as Image from '@Service/Image'
import * as WebEngine from '@Container/WebEngine'

export type InfoLogging = {
  message: [sql: string, timing?: number] | string
}

export type ErrorLogging = {
  error: string
}

export type MainCallback = (fnCallback: {
  ctx: {
    environment: typeof Environment.ENV
    algorithmia: typeof Algorithmia.Context
    wikipedia: typeof Wikipedia.Context
    logger: typeof Logger.Context
    sentry: typeof Sentry.Context
    database: typeof Sequelize.Context
  }
  application: {
    state: typeof State.Context
    readline: typeof ReadLine.Context
    sentences: typeof Sentence.Context
    watson: typeof Watson.Context
    google: typeof Google.Context
    downloader: typeof Downloader.Context
    lexical: typeof Lexical.Context
    site: typeof WebEngine.Context
  }
  toolbox: typeof Gluegun.Context
  service: {
    input: typeof Input.Context.input
    text: typeof Text.Context.text
    image: typeof Image.Context.image
  }
  config: {
    wikiParser: typeof WikiParser.Config
  }
}) => void
