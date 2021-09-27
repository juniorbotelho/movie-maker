import * as Environment from '@App/Environment'
import * as Algorithmia from '@App/Algorithmia'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import * as ReadLine from '@Utilities/ReadLine'
import * as State from '@Utilities/State'
import * as Sentence from '@Utilities/Sentence'
import * as Watson from '@Utilities/Watson'
import * as Google from '@Utilities/Google'
import * as Input from '@Service/Input'
import * as Text from '@Service/Text'
import * as Image from '@Service/Image'

export type ErrorLogging = {
  error?: string
  message: string
}

export type LoggerProps = {
  error?: string
}

export type MainCallback = (fnCallback: {
  ctx: {
    environment: typeof Environment.ENV
    algorithmia: typeof Algorithmia.Context
    logger: typeof Logger.Logging
    sentry: typeof Sentry.Context
  }
  application: {
    state: typeof State.Context
    readline: typeof ReadLine.Context
    sentences: typeof Sentence.Context
    watson: typeof Watson.Context
    google: typeof Google.Context
  }
  service: {
    input: typeof Input.Context.input
    text: typeof Text.Context.text
    image: typeof Image.Context.image
  }
}) => void
