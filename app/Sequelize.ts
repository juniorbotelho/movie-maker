import * as Database from 'sequelize'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'

const sentry = Sentry.Context
const logger = Logger.Context

const transaction = sentry.startTransaction({
  name: 'Sequelize',
  op: 'App/Sequelize',
  description: 'Sequelize contexto to instance database.',
})

const Sequelize = new Database.Sequelize({
  dialect: 'sqlite',
  storage: 'temp/content.sqlite',
  logging: (...message) => logger.info(message),
})

/**
 * Serves to test if the connection to the database
 * is really working, this function is not available
 * in the context of the application.
 */
export const Authenticate = () => {
  try {
    Sequelize.authenticate().catch((error) => {
      throw new Error(error)
    })
  } catch (error) {
    logger.error(error)
    sentry.captureException(error)
  } finally {
    transaction.finish()
  }
}

/**
 * Export database settings as global context
 * for better access to processes and procedures.
 */
export const Context = Sequelize
