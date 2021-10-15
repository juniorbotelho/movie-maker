import * as Main from '@App/Main'
import * as Type from '@Type/Global'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Text'))

const Knowledges = () => ({
  build: () => {
    Main.Application(async ({ ctx, application }) => {
      const content = application.state.load()
      const watson = application.watson.nlu()
      const translator = application.watson.ltd()

      // Config to steps
      let steps = 1
      const allSteps = content.sentences.length

      /**
       * This iteration is more dynamic than the 'map' by
       * Promise.all, prefer to use this format for
       * calls to remote APIs.
       */
      for (const sentence of content.sentences) {
        console.clear()
        ctx.logger.info(`[Service/Text] 🚀 Step [${steps}] of [${allSteps}]`)

        /**
         * It connects to the IBM translation service and
         * translates each sentence into the English language
         * so that the following procedures can be completed
         * successfully.
         */
        ctx.logger.success('[Service/Text] 🔵 Try to get translated text!')
        const translated = await translator.translate({
          text: [sentence.text],
          source: 'pt',
          target: 'en',
        })
        ctx.logger.success('[Service/Text] 🟢 Translator has passed!')

        /**
         * Connects to rapidapi's summarize service and create new
         * lexical summaries for each sentence, but this time
         * these summaries are based on the result of the previous
         * service.
         */
        ctx.logger.success('[Service/Text] 🔵 Try to get summarize api!')
        const summarize = await application.rapidapi.summarization({
          text: translated.result.translations
            .map((item) => item.translation)
            .reduce((item) => item),
          num_sentences: 3,
        })
        ctx.logger.success('[Service/Text] 🟢 Summarize api has passed!')

        /**
         * With the result of the previous server, the next procedure
         * connects to the rapidapi service to rewrite the text in order
         * to prevent the result of possible plagiarism.
         */
        ctx.logger.success('[Service/Text] 🔵 Try to get rewriter text!')
        const rewriter = await application.rapidapi.rewriter({
          text: summarize.summary,
          language: 'en',
          strength: 3,
        })
        ctx.logger.success('[Service/Text] 🟢 Rewriter api has passed!')

        /**
         * It connects to the IBM service and brings some keywords
         * based on the completed search, each sentence must generate
         * one or more keywords to be used as a final resource.
         */
        ctx.logger.info('[Service/Text] 🔵 Try to get keywords with Watson!')
        const analyzed = await watson.analyze({
          text: sentence.text,
          features: {
            keywords: {},
          },
        })
        ctx.logger.success('[Service/Text] 🟢 Keywords from Watson passed!')

        /**
         * Add the result of the translations to the content,
         * this will serve each sentence individually.
         */
        sentence.translated = translated.result.translations
          .map((item) => item.translation)
          .flat()

        /**
         * Add the result of the rewriter to the content,
         * this will serve each sentence individually.
         */
        sentence.rewriter = rewriter.rewrite

        /**
         * Add the result of the summarize api to the content,
         * this will serve each sentence individually.
         */
        sentence.summary = summarize.summary

        /**
         * Add the result of the translations to the content,
         * this will serve each sentence individually.
         */
        const returnToDefault = await translator.translate({
          text: [rewriter.rewrite],
          source: 'en',
          target: 'pt',
        })

        /**
         * Add the result of the default text to the content,
         * this will serve each sentence individually.
         */
        sentence.result = returnToDefault.result.translations
          .map((item) => item.translation)
          .flat()

        /**
         * It has the function of adding the necessary
         * keywords to the sentence object.
         */
        sentence.keywords = analyzed.result.keywords
          .map((textualSentenceItem) => textualSentenceItem.text)
          .flat()

        // Add new step
        steps += steps
      }
    })
  },
})

const Service = () => ({
  text: (fnCallback) =>
    Main.Application(async ({ ctx, application, config }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Text Service',
        op: 'Service/Text',
        description: 'Get survey data via algorithmia.',
      })

      const content: Type.StateRules = application.state.load()

      const watson = application.watson.nlu()

      const translator = application.watson.ltd()

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

        /**
         * Block responsible for sanitizing the text and removing
         * all invalid characters, this block is important so that
         * there are no breaks in words and/or lexical text.
         */
        const sanitized = Sanitize().standardMarkdown(content)
        content.sourceContentSanitized = sanitized
        const workaroundToDisableThis = false

        // TODO: add a function to use choice if algorithmia summarize will be used
        if (workaroundToDisableThis) {
          ctx.logger.info('[Service/Text] 🔵 Try to get summarize from algo.')
          const summarized = await ctx.algorithmia
            .algo('nlp/Summarizer/0.1.8?timeout=30')
            .pipe(sanitized)
          ctx.logger.success('[Service/Text] 🟢 Summarize from algo passed!')
          content.sourceSummarized = summarized.get()
        }

        /**
         * Checks for pre-generated lexical content, if not,
         * new lexical content is generated and added to
         * the content object.
         */
        if (!content.summary) {
          ctx.logger.info('[Service/Text] 🔵 Try to get lexical from lexrank.')
          const lexical = await application.lexical.lexrank({
            text: sanitized,
            lineCount: 3,
          })
          ctx.logger.success('[Service/Text] 🟢 Lexical from lexrank passed!')
          content.summary = lexical.toplines.reduce((item) => item).text
        }

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
              translated: [],
              keywords: [],
              images: [],
              result: [],
            })
          })

        /**
         * Section responsible for Watson interpretation and
         * for generating tags and keywords that will be
         * necessary to perform searches and others.
         */
        content.sentences = content.sentences.slice(0, content.maximumSentences)

        /**
         * Create the summary/summary of the downloaded text,
         * this summary will be used to add an introduction
         * to Instagram.
         */
        const getSummary = async () => {
          ctx.logger.info('[Service/Text] 🔵 Getting summary from API!')
          const { result: rText } = await translator.translate({
            text: [content.sourceContentSanitized],
            source: 'pt',
            target: 'en',
          })

          const { summary } = await application.rapidapi.summarization({
            text: rText.translations.reduce((i) => i).translation,
            num_sentences: 3,
          })

          const { rewrite } = await application.rapidapi.rewriter({
            text: summary,
            language: 'en',
            strength: 3,
          })

          const { result: rSum } = await translator.translate({
            text: [rewrite],
            source: 'en',
            target: 'pt',
          })
          ctx.logger.success('[Service/Text] 🟢 Summary from API has passed!')

          content.summary = rSum.translations.reduce((i) => i).translation
        }

        /**
         * Creates the content of keywords, texts and summaries
         * based on the arguments passed above, note that the
         * main function is disabled by the workaround.
         */
        const getKeyword = async () => {
          if (workaroundToDisableThis) {
            Knowledges().build()
          } else {
            // Config to steps
            let steps = 1
            const allSteps = content.sentences.length

            for (const sentence of content.sentences) {
              console.clear()
              ctx.logger.info(
                `[Service/Text] 🚀 Step [${steps}] of [${allSteps}]`
              )

              /**
               * It connects to the IBM service and brings some keywords
               * based on the completed search, each sentence must generate
               * one or more keywords to be used as a final resource.
               */
              ctx.logger.info('[Service/Text] 🔵 Getting keywords with Watson!')
              const analyzed = await watson.analyze({
                text: sentence.text,
                features: {
                  keywords: {},
                },
              })

              /**
               * With the result of the previous server, the next procedure
               * connects to the rapidapi service to rewrite the text in order
               * to prevent the result of possible plagiarism.
               */
              const { rewrite } = await application.rapidapi.rewriter({
                text: sentence.text,
                language: 'pt',
                strength: 3,
              })

              sentence.text = rewrite

              /**
               * It has the function of adding the necessary
               * keywords to the sentence object.
               */
              sentence.keywords = analyzed.result.keywords
                .map((textualSentenceItem) => textualSentenceItem.text)
                .flat()
              ctx.logger.success('[Service/Text] 🟢 Keywords has passed!')
              // Add new step
              steps = steps + 1
            }
          }
        }

        /**
         * Call to the functions that will perform the
         * steps necessary for the text service to
         * work correctly.
         */
        await getSummary()
        await getKeyword()

        // Save
        application.state.save(content)
        await fnCallback()
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
