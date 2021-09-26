import * as Environment from '@App/Environment'
import * as Logger from '@App/Logger'
import * as Sentry from '@App/Sentry'
import * as ReadLine from '@Utilities/ReadLine'
import * as State from '@Utilities/State'
import { MainCallback } from '@Type/App'

export const Application = (fnCallback: MainCallback) => {
  fnCallback({
    ctx: {
      environment: Environment.ENV,
      logger: Logger.Logging,
      sentry: Sentry.Context,
    },
    application: {
      state: State.Context,
      readline: ReadLine.Context,
    },
  })
}
