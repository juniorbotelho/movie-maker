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
   * Load a file called 'template.json' containing the
   * engines that will be used as a search and request
   * template by the web-engine module.
   */
  async loadFromFile(directory) {
    await Main.Application(async ({ ctx, application }) => {
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
   * The addition is the engine name and the value
   * belonging to that engine. Usually a url.
   */
  add(name, value) {
    this.registry.set(name, value)
    return this
  },

  /**
   * Lists all data stored in registry memory,
   * this listing is just the registry keys,
   * without the key value.
   */
  listAll() {
    const registryMemory: Map<string, string> = this.registry
    return Array.from(registryMemory.keys())
  },

  /**
   * Queries a specific key in the mapper,
   * the return is related to the value of
   * the previously added key.
   */
  query(name) {
    const registryMemory: Map<string, string> = this.registry
    return registryMemory.get(name)
  },
})

export const Context = Container()
