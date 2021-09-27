import * as Environment from '@App/Environment'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import * as ReadLine from '@Utilities/ReadLine'
import * as State from '@Utilities/State'
import * as Input from '@Service/Input'

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
    logger: typeof Logger.Logging
    sentry: typeof Sentry.Context
  }
  application: {
    state: typeof State.Context
    readline: typeof ReadLine.Context
  }
  service: {
    input: typeof Input.Context
  }
}) => void
