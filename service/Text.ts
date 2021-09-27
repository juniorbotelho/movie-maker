import * as Main from '@App/Main'

const Service = () => ({
  text: () =>
    Main.Application(async ({ ctx, application }) => {
      const content = application.state.load()

      const article = await ctx.algorithmia
        .algo('web/WikipediaParser/0.1.2')
        .pipe(content.searchTerm)

      console.log(article.get())
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all readline functions.
 */
export const Context = Service()
