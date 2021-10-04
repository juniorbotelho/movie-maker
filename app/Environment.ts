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
    apikey: CPUNode['IBM_APIKEY'],
    iam_apikey_description: CPUNode['IBM_IAM_APIKEY_DESCRIPTION'],
    iam_apikey_name: CPUNode['IBM_IAM_APIKEY_NAME'],
    iam_role_crn: CPUNode['IBM_IAM_ROLE_CRN'],
    iam_serviceid_crn: CPUNode['IBM_IAM_SERVICEID_CRN'],
    url: CPUNode['IBM_URL'],
    features: {
      IBM_NLU_URL: CPUNode['IBM_NLU_URL'],
      IBM_LTD_URL: CPUNode['IBM_LTD_URL'],
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
