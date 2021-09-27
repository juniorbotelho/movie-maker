import * as Chalk from 'chalk'
import * as Type from '@Type/App'

function infoLogging({ message }: Type.InfoLogging) {
  message && console.info(Chalk.blue(message))
}

function errorLogging({ error, message }: Type.ErrorLogging) {
  error && console.error(Chalk.red(error))
  message && console.error(Chalk.red(message))
}

function successLogging({ message }: Type.InfoLogging) {
  message && console.log(Chalk.green(message))
}

export const Logging = ({ error }: Type.LoggerProps) => ({
  error: (message: string) => errorLogging({ error, message }),
  info: (message: string) => infoLogging({ message }),
  success: (message: string) => successLogging({ message }),
})
