import Axios from 'axios'
import Cheerio from 'cheerio'
import * as Main from '@App/Main'
import * as Sanitize from 'sanitize-html'
import * as Lexical from '@Utilities/Lexical'

export type SiteRequest = {
  engine: 'geekhunter'
  route: string
}

const Site = () => ({
  request: async ({ engine, route }: SiteRequest) =>
    await Main.Application(async ({ ctx, application, config, service }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Blogs',
        op: 'Site/Blogs',
        description: 'Service to provide textual content from specific blogs.',
      })

      const blog = Axios.create({
        baseURL: 'blog.geekhunter.com.br', // todo: add support for this: ctx.site.engine(engine),
        timeout: 30000,
      })

      try {
        const { data } = await blog.get(route)

        const htmlSanitized = Sanitize(data)

        const html = Cheerio.load(htmlSanitized)

        const title = html('h1').text()

        const content = html('p').text()

        const lexicalCtx = await Lexical.Context.lexrank({
          text: content,
          lineCount: 20,
        })

        /**
         * Return a data structure where title and
         * content were already summarized by the
         * first summarization engine.
         */
        return {
          title,
          content: lexicalCtx,
        }
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
