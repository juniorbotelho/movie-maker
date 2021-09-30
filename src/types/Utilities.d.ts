export type WikipediaRequest = {
  searchTerm: string
  lang: 'en' | 'es' | 'pt' | string
}

export type WikipediaResponse = {
  pageid: number
  links: string[]
  references: string[]
  content: string
  summary: string
  images: string[]
  title: string
  url: string
}

export type WikipediaSwitcher = (
  suggestions: WikipediaSearchSuggestions[]
) => number

export type WikipediaSearchAxios = [string, string[], string[], string[]]

export type WikipediaSearchSuggestions = {
  title: string
  generic?: string
  link: string
}

export type WikipediaSearchResponse = {
  searchTerm: string
  data?: WikipediaSearchAxios
  suggestions: WikipediaSearchSuggestions[]
}

export type WikipediaContentResponse = {
  pageid: number
  ns?: number
  title: string
  extract: string
  images: {
    ns: number
    title: string
  }[]
  links: {
    ns: number
    title: string
  }[]
  contentmodel?: string
  pagelanguage?: string
  pagelanguagedir?: string
  touched?: string
  lastrevid?: number
  length?: number
  extlinks: {
    '*': string
  }[]
}

export type WikipediaImageResponse = {
  pageid: number
  ns?: number
  title: string
  imagerepository?: string
  imageinfo: {
    url: string
    descriptionurl: string
    descriptionshorturl: string
  }[]
}
