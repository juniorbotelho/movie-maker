import * as LexRank from 'lexrank'
import * as Sentry from '@App/Sentry'
import * as Logger from '@App/Logger'
import * as Type from '@Type/Global'

const transaction = Sentry.Context.startTransaction({
  name: 'Lexical',
  op: 'Utilities/Lexical',
  description: 'Get the lexical context from a article in web.',
})

const Wrapper = () => ({
  lexrank: async ({
    text,
    lineCount,
    pageUrl: lexicalAsPageHostingUrl,
  }: Type.LexRankProps) => {
    return new Promise<Type.LexRankResponse>((resolve, reject) => {
      try {
        if (lexicalAsPageHostingUrl) {
          LexRank.summarizePage(
            text,
            lineCount,
            (error: Error, toplines: Type.LexRankTopLines[], text: string) => {
              if (error)
                throw new Error(`An error has ocurred in context: ${error}`)

              /**
               * Asynchronously returns the same values
               * identified by the 'lexrank' library.
               */
              resolve({ toplines: toplines, text })
            }
          )
        } else {
          LexRank.summarize(
            text,
            lineCount,
            (error: Error, toplines: Type.LexRankTopLines[], text: string) => {
              if (error)
                throw new Error(`An error has ocurred in context: ${error}`)

              /**
               * Asynchronously returns the same values
               * identified by the 'lexrank' library.
               */
              resolve({ toplines: toplines, text })
            }
          )
        }
      } catch (error) {
        Logger.Context.error(error)
        Sentry.Context.captureException(error)
        reject(error)
      } finally {
        transaction.finish()
      }
    })
  },
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all lexrank functions.
 */
export const Context = Wrapper()
