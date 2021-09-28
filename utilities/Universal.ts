import { config, DotenvConfigOptions, DotenvConfigOutput } from 'dotenv'

declare type UECUtilConfig = typeof config
declare type UECUtilCallback = (opt: DotenvConfigOutput) => void

export class UECUtil {
  private options: DotenvConfigOptions = null
  private config: UECUtilConfig = null

  public setLoader(config: UECUtilConfig): UECUtil {
    this.config = config
    return this
  }

  public setOption(options?: DotenvConfigOptions): UECUtil {
    this.options = options
    return this
  }

  public builder(callback?: UECUtilCallback): void {
    const confObj = this.config(this.options)
    return callback(confObj)
  }
}
