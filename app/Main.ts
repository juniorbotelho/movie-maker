import * as Environment from '@App/Environment'
import * as Logger from '@App/Logger'
import * as Sentry from '@App/Sentry'
import * as ReadLine from '@Utilities/ReadLine'
import { MainCallback } from '@Type/App'

export const Application = (fnCallback: MainCallback) => {
  fnCallback({
    ctx: {
      environment: Environment.ENVContext,
      logger: Logger.Logging,
      sentry: Sentry.Context,
    },
    application: {
      readline: ReadLine.Context,
    },
  })
}
