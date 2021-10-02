import * as Type from '@Type/Global'

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
