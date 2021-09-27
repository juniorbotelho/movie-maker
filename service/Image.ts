import * as Main from '@App/Main'
import * as Type from '@Type/Global'

const Service = () => ({
  image: () =>
    Main.Application(async ({ ctx, application }) => {
      const content: Type.RuleState = application.state.load()

      console.log(content)
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all image functions.
 */
export const Context = Service()
