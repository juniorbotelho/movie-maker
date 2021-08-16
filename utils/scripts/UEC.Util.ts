import { config, DotenvConfigOptions, DotenvConfigOutput } from 'dotenv'

declare type UECUtilConfig = typeof config
declare type UECUtilCallback = (opt: DotenvConfigOutput) => void

export class UECUtil {

  private options: DotenvConfigOptions = null
  private config: UECUtilConfig = null

  public setLoader(config: UECUtilConfig) {
    this.config = config
    return this
  }

  public setOption(options?: DotenvConfigOptions) {
    this.options = options
    return this
  }

  public builder(callback?: UECUtilCallback) {
    const confObj = this.config(this.options)
    return callback(confObj)
  }
}
