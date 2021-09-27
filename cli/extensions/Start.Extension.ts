import { GluegunToolbox } from 'gluegun'
import * as Main from '@App/Main'

export default (toolbox: GluegunToolbox): void => {
  toolbox.services = () => {
    Main.Application(({ service }) => {
      service.input(toolbox, async () => {
        await service.text()
      })
    })
  }
}
