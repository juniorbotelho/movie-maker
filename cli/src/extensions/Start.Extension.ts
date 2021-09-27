import { GluegunToolbox } from 'gluegun'
import * as Main from '@App/Main'

export default (toolbox: GluegunToolbox): void => {
  toolbox.services = () => {
    Main.Application(async ({ service }) => {
      await service.input(toolbox) // todo: bug
      await service.text()
    })
  }
}
