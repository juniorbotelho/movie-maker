import * as Logger from '@App/Logger'
import * as Sentry from '@App/Sentry'
import * as ReadLine from 'readline'

const logger = Logger.Logging({})

const transaction = Sentry.Context.startTransaction({
  name: 'Global ReadLine Function',
  op: 'Utilities/ReadLine',
  description: 'Serves to add synchronous readline support to the application.',
})

const App = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const Wrapper = () => ({
  question: (question: string) =>
    new Promise<string>(() => {
      App.question(question, (answer) => {
        try {
          Promise.resolve(answer)
          App.close() // Close event
        } catch (error) {
          Sentry.Context.captureException(error)
          logger.error(error)
          Promise.reject(error)
        } finally {
          transaction.finish()
        }
      })
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all readline functions, Only keys
 * encapsulated object that will serve as the basis for all
 * functions of the 'readline'.
 */
export const Context = Wrapper()
