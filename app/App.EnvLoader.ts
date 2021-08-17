import { config as UniversalEnvConfig } from 'dotenv'
import { UECUtil } from 'config/scripts/UEC.Util'

const UniversalEnvUtil = new UECUtil().setLoader(UniversalEnvConfig).setOption()

export default {}

/**
 * Pay attention to this call, this is where the global
 * environment variables will be encapsulated and distributed
 * to other classes and functions in the project.
 */
UniversalEnvUtil.builder((config) =>
  Object.defineProperty(config.parsed, 'ctx', {
    enumerable: true,
    configurable: true,
    writable: false,
    value: [],
  })
)
