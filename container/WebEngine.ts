import * as Type from '@Type/Global'

const searchEngines = new Map()

searchEngines.set('geekhunter', 'https://blog.geekhunter.com.br/')
searchEngines.set('geekforgeeks', 'https://blog.geekforgeeks.com/')

const Container: Type.WebEngineContainer = () => ({
  ...Object.defineProperty({}, 'search', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: null,
  }),

  ...Object.defineProperty({}, 'requested', {
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
      this.search = response
    }

    return this
  },
  async request({ route, blog, lexical }) {
    if (this.selectedEngine.includes('geekhunter')) {
      const template: Type.WebEngineTemplate = require(`temp/template/${this.selectedEngine}.min.template`)
      const response = await template.templateRequest(route, blog, lexical)
      this.requested = response
    }

    return this
  },
  nextPage() {
    console.log('nextPage', 'That function already to create!')
  },
  buildSearch() {
    return this.response
  },
  buildRequest() {
    return this.requested
  },
})

/**
 * Instantiates the WebEngine function to get content
 * from websites in general based on templates.
 */
export const Context = Container()
