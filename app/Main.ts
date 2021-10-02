import * as Environment from '@App/Environment'
import * as Algorithmia from '@App/Algorithmia'
import * as Logger from '@App/Logger'
import * as Sentry from '@App/Sentry'
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
import * as Type from '@Type/App'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Main'))

export const Application = (fnCallback: Type.MainCallback) =>
  new Promise<void>(() => {
    fnCallback({
      ctx: {
        environment: Environment.ENV,
        algorithmia: Algorithmia.Context,
        wikipedia: Wikipedia.Context,
        logger: Logger.Context,
        sentry: Sentry.Context,
        database: Sequelize.Context,
      },
      application: {
        state: State.Context,
        readline: ReadLine.Context,
        sentences: Sentence.Context,
        watson: Watson.Context,
        google: Google.Context,
        downloader: Downloader.Context,
        lexical: Lexical.Context,
        site: WebEngine.Context,
      },
      toolbox: Gluegun.Context,
      service: {
        input: Input.Context.input,
        text: Text.Context.text,
        image: Image.Context.image,
      },
      config: {
        wikiParser: WikiParser.Config,
      },
    })
  })
