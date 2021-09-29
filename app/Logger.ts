import * as Chalk from 'chalk'
import * as Type from '@Type/App'

function infoLogging({ message }: Type.InfoLogging) {
  message && console.info(Chalk.blue(message))
}

function errorLogging({ error }: Type.ErrorLogging) {
  error && console.error(Chalk.red(error))
}

function successLogging({ message }: Type.InfoLogging) {
  message && console.log(Chalk.green(message))
}

const Logging = () => ({
  error: (error: string) => errorLogging({ error }),
  info: (message: [sql: string, timing?: number] | string) =>
    infoLogging({ message }),
  success: (message: string) => successLogging({ message }),
})

export const Context = Logging()
