import * as Environment from '@App/Environment'
import * as Algorithmia from '@App/Algorithmia'
import * as Logger from '@App/Logger'
import * as Sentry from '@App/Sentry'
import * as ReadLine from '@Utilities/ReadLine'
import * as State from '@Utilities/State'
import * as Input from '@Service/Input'
import * as Text from '@Service/Text'
import { MainCallback } from '@Type/App'

export const Application = (fnCallback: MainCallback) =>
  new Promise<void>(() => {
    fnCallback({
      ctx: {
        environment: Environment.ENV,
        algorithmia: Algorithmia.Context,
        logger: Logger.Logging,
        sentry: Sentry.Context,
      },
      application: {
        state: State.Context,
        readline: ReadLine.Context,
      },
      service: {
        input: Input.Context.input,
        text: Text.Context.text,
      },
    })
  })
