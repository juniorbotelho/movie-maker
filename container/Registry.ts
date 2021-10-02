import * as Main from '@App/Main'
import * as Type from '@Type/Global'
import * as Path from 'path'
import * as FileSystem from 'fs'
import * as Chalk from 'chalk'

console.log(Chalk.green('🚀 Loaded: Registry'))

declare type TemplateFileSchema = {
  templates: {
    title: string
    name: string
    value: string
  }[]
}

const Container: Type.RegistryContainer = () => ({
  ...Object.defineProperty({}, 'registry', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: new Map<string, string>(),
  }),

  /**
   *
   */
  loadFromFile(directory) {
    Main.Application(async ({ ctx, application }) => {
      const transaction = ctx.sentry.startTransaction({
        name: 'Registry',
        op: 'Container/Registry',
        description: 'Module to load template config from json file.',
      })

      const template = Path.resolve(directory, 'templates.json')

      try {
        if (FileSystem.existsSync(template)) {
          const localFile = FileSystem.readFileSync(template)
          const schema: TemplateFileSchema = JSON.parse(localFile.toString())

          schema.templates.forEach((item) =>
            application.registry.add(item.name, item.value)
          )
        } else {
          throw new Error('[Registry] 🔴 Template not found or not exists!')
        }
      } catch (error) {
        ctx.logger.error(error)
        ctx.sentry.captureException(error)
      } finally {
        transaction.finish()
      }
    })
  },

  /**
   *
   */
  add(name, value) {
    this.registry.set(name, value)
    return this
  },

  /**
   *
   */
  listAll() {
    const registryMemory: Map<string, string> = this.registry
    return Array.from(registryMemory.keys())
  },

  /**
   *
   */
  query(name) {
    const registryMemory: Map<string, string> = this.registry
    return registryMemory.get(name)
  },
})

export const Context = Container()
