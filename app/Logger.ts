import * as Chalk from 'chalk'
import { ErrorLogging, LoggerProps } from '@Type/App'

function errorLogging({ error, message }: ErrorLogging) {
  error && console.error(Chalk.red(error))
  message && console.error(Chalk.red(message))
}

export const Logging = ({ error }: LoggerProps) => ({
  error: (message: string) => errorLogging({ error, message }),
})
