import * as Environment from '@App/Environment'
import * as Algorithmia from '@App/Algorithmia'
import * as Logger from '@App/Logger'
import * as Sentry from '@App/Sentry'
import * as ReadLine from '@Utilities/ReadLine'
import * as State from '@Utilities/State'
import * as Sentence from '@Utilities/Sentence'
import * as Watson from '@Utilities/Watson'
import * as Google from '@Utilities/Google'
import * as Downloader from '@Utilities/Downloader'
import * as Input from '@Service/Input'
import * as Text from '@Service/Text'
import * as Image from '@Service/Image'
import * as Type from '@Type/App'

export const Application = (fnCallback: Type.MainCallback) =>
  new Promise<void>(() => {
    fnCallback({
      ctx: {
        environment: Environment.ENV,
        algorithmia: Algorithmia.Context,
        logger: Logger.Context,
        sentry: Sentry.Context,
      },
      application: {
        state: State.Context,
        readline: ReadLine.Context,
        sentences: Sentence.Context,
        watson: Watson.Context,
        google: Google.Context,
        downloader: Downloader.Context,
      },
      service: {
        input: Input.Context.input,
        text: Text.Context.text,
        image: Image.Context.image,
      },
    })
  })
