import * as Main from '@App/Main'
import * as Type from '@Type/Global'

const Service = () => ({
  text: () =>
    Main.Application(async ({ ctx, application, config }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Text Service',
        op: 'Service/Text',
        description: 'Get survey data via algorithmia.',
      })

      const content: Type.StateRules = application.state.load()
      const watson = application.watson.nlu()
      const searchWith = {
        articleTerm: content.searchTerm,
        lang: 'en',
      }

      const Sanitize = () => ({
        standardMarkdown: (text: Type.StateRules) =>
          text.sourceContentOriginal
            .split('\n')
            .filter((line) => {
              if (line.trim().length == 0 || line.trim().startsWith('='))
                return false
              return true
            })
            .join(' ')
            .replace(/\((?:\([^()]*\)|[^()])*\)/gm, '')
            .replace(/ {2}/g, ' '),
      })

      // Initialize
      ctx.logger.info('[Service/Text] 🚀 Initialize text service...')

      try {
        /**
         * Responsible for returning the full wikipedia article
         * about the search term using the 'algorithmia' platform.
         */
        config.wikiParser
          .includes('algorithmia|wikipedia')
          .is('algorithmia', async () => {
            ctx.logger.info(
              '[Service/Text] 🔵 Try to get text from algorithmia.'
            )

            const article = await ctx.algorithmia
              .algo('web/WikipediaParser/0.1.2?timeout=30')
              .pipe(searchWith)

            /**
             * After returning the text content from wikipedia,
             * you need to save it as part of the state
             * content of the content.json file.
             */
            content.sourceContentOriginal = article.get().content

            ctx.logger.success(
              '[Service/Text] 🟢 Text from algorithmia passed!'
            )
          })

        const sanitized = Sanitize().standardMarkdown(content)

        content.sourceContentSanitized = sanitized

        ctx.logger.info('[Service/Text] 🔵 Try to get summarize from algo.')

        const summarized = await ctx.algorithmia
          .algo('nlp/Summarizer/0.1.8?timeout=30')
          .pipe(sanitized)

        ctx.logger.success('[Service/Text] 🟢 Summarize from algo passed!')

        content.sourceSummarized = summarized.get()

        ctx.logger.info('[Service/Text] 🔵 Try to get lexical from lexrank.')

        const lexical = await application.lexical.lexrank({
          text: sanitized,
          lineCount: 10,
        })

        ctx.logger.success('[Service/Text] 🟢 Lexical from lexrank passed!')

        content.sourceLexical = lexical

        /**
         * Adds all sentences to the scope of
         * attributes belonging to sanitized
         * text sentences.
         */
        application
          .sentences(content.sourceContentSanitized)
          .forEach((sentence) => {
            content.sentences.push({
              text: sentence,
              keywords: [],
              images: [],
            })
          })

        /**
         * Section responsible for Watson interpretation and
         * for generating tags and keywords that will be
         * necessary to perform searches and others.
         */
        content.sentences = content.sentences.slice(0, content.maximumSentences)

        ctx.logger.info('[Service/Text] 🔵 Try to get keywords with Watson!')

        /**
         * This iteration is more dynamic than the 'map' by
         * Promise.all, prefer to use this format for
         * calls to remote APIs.
         */
        for (const sentence of content.sentences) {
          const { result } = await watson.analyze({
            text: sentence.text,
            features: {
              keywords: {},
            },
          })

          /**
           * It has the function of adding the necessary
           * keywords to the sentence object.
           */
          sentence.keywords = result.keywords
            .map((textualSentenceItem) => textualSentenceItem.text)
            .flat()
        }

        ctx.logger.success('[Service/Text] 🟢 Keywords from Watson passed!')

        // Save
        application.state.save(content)
      } catch (error) {
        ctx.logger.error('[Service/Text] 🔴 '.concat(error))
        ctx.sentry.captureException(error)
      } finally {
        transaction.finish()
      }
    }),
})

/**
 * Just the keys of the encapsulated object that will serve
 * as the basis for all readline functions.
 */
export const Context = Service()
