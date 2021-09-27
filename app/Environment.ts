import { config as UniversalEnvConfig } from 'dotenv'
import { UECUtil } from '@Utilities/UEC.Util'

const UniversalEnvUtil = new UECUtil().setLoader(UniversalEnvConfig).setOption()

/**
 * This creates an instance of the dotenv model used in the
 * project so the environment variables can be read.
 */
UniversalEnvUtil.builder((config) =>
  Object.defineProperty(config.parsed, '', {
    enumerable: true,
    configurable: true,
    writable: false,
    value: [],
  })
)

const CPUNode = process.env

const localEnv = {}

/**
 * this is the local function that allows you
 * to export a module of the project's environment
 * variable methods one by one.
 */
const ENVContext = () => ({
  ...Object.defineProperty(localEnv, 'ctx', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: {},
  }),

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

  /**
   * Pay attention to this call, this is where the global
   * environment variables will be encapsulated and distributed
   * to other classes and functions in the project.
   */
  globalContext: (itemName: string) => CPUNode[itemName],
})

export const ENV = ENVContext()
