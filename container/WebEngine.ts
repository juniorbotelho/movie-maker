import * as Type from '@Type/Global'

const searchEngines = new Map()

searchEngines.set('geekhunter', 'https://blog.geekhunter.com.br/')
searchEngines.set('geekforgeeks', 'https://blog.geekforgeeks.com/')

const Container: Type.WebEngineContainer = () => ({
  ...Object.defineProperty({}, 'searchSchemma', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: null,
  }),

  ...Object.defineProperty({}, 'requestSchema', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: null,
  }),

  ...Object.defineProperty({}, 'selectedEngine', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: null,
  }),

  ...Object.defineProperty({}, 'mode', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: null,
  }),

  /**
   * It resolves which engine will be used to obtain
   * data from the site, this engine will be defined
   * as a hidden attribute of the instance.
   */
  engine(engine) {
    this.selectedEngine = engine
    return searchEngines.get(engine)
  },

  /**
   * Responsible function do a search through the selected
   * engine/template, this way the data will be available
   * globally.
   */
  async search({ search, blog, page = 1 }) {
    if (this.selectedEngine.includes('geekhunter')) {
      const template: Type.WebEngineTemplate = require(`temp/template/${this.selectedEngine}.min.template`)
      const response = await template.templateSearch(search, blog, page)
      this.searchSchema = response
      this.mode = 'search'
    }

    return this
  },
  async request({ route, blog, lexical }) {
    if (this.selectedEngine.includes('geekhunter')) {
      const template: Type.WebEngineTemplate = require(`temp/template/${this.selectedEngine}.min.template`)
      const response = await template.templateRequest(route, blog, lexical)
      this.requestSchema = response
      this.mode = 'request'
    }

    return this
  },
  nextPage() {
    console.log('nextPage', 'That function already to create!')
  },
  build(mode) {
    if (mode.includes('search')) return this.searchSchema
    if (mode.includes('request')) return this.requestSchema
  },
})

/**
 * Instantiates the WebEngine function to get content
 * from websites in general based on templates.
 */
export const Context = Container()
