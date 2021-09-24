import * as Environment from '@App/Environment'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'

export type ErrorLogging = {
  error?: string
  message: string
}

export type LoggerProps = {
  error?: string
}

export type MainCallback = (fnCallback: {
  ctx: {
    environment: typeof Environment.ENVContext
    logger: typeof Logger.Logging
    sentry: typeof Sentry.Context
  }
  application: any
}) => void
