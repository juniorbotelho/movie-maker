import Axios from 'axios'
import * as Main from '@App/Main'
import * as Type from '@Type/Site'

const Site: Type.SiteModuleFunction = () => ({
  search: async (search, engine) =>
    await Main.Application(async ({ ctx, application }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Blog Search',
        op: 'Site/Blogs',
        description: 'Provides a model to search topics in blogs.',
      })

      const blog = Axios.create({
        baseURL: application.site.engine(engine),
        timeout: 30000,
      })

      try {
        const response = await application.site.search({
          blog: blog,
          search: search,
        })

        console.log('searchSchema', response.build('search'))
      } catch (error) {
        ctx.logger.error(`[Site/Blogs] 🔴 ${error}`)
        ctx.sentry.captureException(error)
      } finally {
        transaction.finish()
      }
    }),
  request: async (route, engine) =>
    await Main.Application(async ({ ctx, application }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Blog Request',
        op: 'Site/Blogs',
        description: 'Service to provide textual content from specific blogs.',
      })

      const blog = Axios.create({
        baseURL: application.site.engine(engine), // todo: add support for this: ctx.site.engine(engine),
        timeout: 30000,
      })

      try {
        const response = await application.site.request({
          route: route,
          blog: blog,
          lexical: application.lexical.lexrank,
        })

        console.log('requestSchema', response.build('request'))
      } catch (error) {
        ctx.logger.error(`[Site/Blogs] 🔴 ${error}`)
        ctx.sentry.captureException(error)
      } finally {
        transaction.finish()
      }
    }),
})

/**
 * Exports the object module from the current
 * context of the application, this export
 * is an instance of the factory Site() function.
 */
export const Context = Site()

Context.search('react', 'geekhunter')
