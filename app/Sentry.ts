import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import * as Environment from '@App/Environment'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Sentry'))

Sentry.init({
  dsn: Environment.ENV.Sentry().dsn,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

/**
 * Export sentry settings as global context
 * for better access to processes and procedures
 */
export { Sentry as Context, Tracing }
