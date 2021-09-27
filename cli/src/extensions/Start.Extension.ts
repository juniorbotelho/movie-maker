import { GluegunToolbox } from 'gluegun'
import * as Main from '@App/Main'

export default (toolbox: GluegunToolbox): void => {
  toolbox.input = () => {
    Main.Application(({ service }) => service.input(toolbox))
  }
}
