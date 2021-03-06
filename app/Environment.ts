import * as DotEnv from 'dotenv'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Environment'))

DotEnv.config({ encoding: 'UTF-8' })

const CPUNode = process.env

/**
 * this is the local function that allows you
 * to export a module of the project's environment
 * variable methods one by one.
 */
const ENVContext = () => ({
  /**
   * Section responsible for setting all local project
   * environment variables.
   */
  Sentry: () => ({
    dsn: CPUNode['DSN_CONNECT'],
  }),

  Algorithmia: () => ({
    apiKey: CPUNode['ALGO_APIKEY'],
  }),

  Watson: () => ({
    nlu: {
      apikey: CPUNode['IBM_NLU_APIKEY'],
      url: CPUNode['IBM_NLU_URL'],
    },
    ltd: {
      apikey: CPUNode['IBM_LTD_APIKEY'],
      url: CPUNode['IBM_LTD_URL'],
    },
  }),

  RapidApi: () => ({
    apiKey: CPUNode['RAPID_APIKEY'],
    rewriter: {
      url: CPUNode['RAPID_REWRITER_URL'],
      host: CPUNode['RAPID_REWRITER_HOST'],
    },
    summarization: {
      url: CPUNode['RAPID_SUMMARIZATION_URL'],
      host: CPUNode['RAPID_SUMMARIZATION_HOST'],
    },
  }),

  Google: () => ({
    apiKey: CPUNode['GOOGLE_API_KEY'],
    searchEngineId: CPUNode['GOOGLE_SEARCH_ENGINE_ID'],
  }),

  /**
   * Pay attention to this call, this is where the global
   * environment variables will be encapsulated and distributed
   * to other classes and functions in the project.
   */
  globalContext: (itemName: string) => CPUNode[itemName],
})

export const ENV = ENVContext()
