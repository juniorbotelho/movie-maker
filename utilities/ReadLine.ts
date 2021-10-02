import * as Logger from '@App/Logger'
import * as Sentry from '@App/Sentry'
import * as ReadLine from 'readline'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: ReadLine'))

const logger = Logger.Context

const transaction = Sentry.Context.startTransaction({
  name: 'ReadLine',
  op: 'Utilities/ReadLine',
  description: 'Serves to add synchronous readline support to the application.',
})

const App = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const Wrapper = () => ({
  question: (question: string) =>
    new Promise<string>((resolve, reject) => {
      App.question(question, (answer) => {
        try {
          resolve(answer)
          Promise.resolve(answer)
          App.close()
        } catch (error) {
          Sentry.Context.captureException(error)
          logger.error(error)
          reject(error)
          Promise.reject(error)
        } finally {
          transaction.finish()
        }
      })
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all readline functions.
 */
export const Context = Wrapper()
