import { config as UniversalEnvConfig } from 'dotenv'
import { UECUtil } from 'utils/scripts/UEC.Util'

const UniversalEnvUtil = new UECUtil()

export default {}

UniversalEnvUtil.setLoader(UniversalEnvConfig)
  .setOption()
  .builder((config) => {
    console.log(config)
  })
