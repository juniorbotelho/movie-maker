import { AxiosInstance } from 'axios'

export type StateSentence = {
  text: string
  keywords: string[]
  images: string[]
  googleSearchQuery?: string
}

type LexRankProps = {
  text: string
  lineCount: number
  pageUrl?: boolean
}

type LexRankTopLines = {
  weight: number
  text: string
  index: number
}

type LexRankResponse = {
  toplines: LexRankTopLines[]
  text: string
}

export type StateRules = {
  maximumSentences?: number
  searchTerm: string
  prefix: string
  customTopic?: string
  downloadedImages?: string[]
  sourceContentOriginal?: string
  sourceContentSanitized?: string
  sourceSummarized?: string
  sourceLexical?: {
    text: string
    toplines: LexRankTopLines[]
  }
  sentences?: StateSentence[]
}

type ImageDownloader = {
  url: string
  directory: string
  name?: string
}

export type WebEngineTemplate = {
  templateSearch: (
    search: string,
    blog: AxiosInstance,
    page?: number
  ) => Promise<SiteSearchResponse>

  templateRequest: (
    route: string,
    blog: AxiosInstance,
    lexical: ({
      text,
      lineCount,
      pageUrl: lexicalAsPageHostingUrl,
    }: LexRankProps) => Promise<LexRankResponse>
  ) => Promise<{
    title: string
    content: LexRankResponse
  }>
}

export type WebEngineSearchRequest = {
  search: string
  page?: number
  blog: AxiosInstance
}

export type SiteRequest = {
  engine: 'geekhunter'
  route: string
}

export type SiteSearchPagination = {
  next: number
  maxPages: number
}

export type SiteSearchPosts = {
  index: number
  link: string
  title: string
}

export type SiteSearchResponse = {
  posts: SiteSearchPosts[]
  pagination: SiteSearchPagination
}

export type SiteSearchRequested = {
  title: string
  content: LexRankResponse
}

export type WebEngineContainerBuilder = {
  nextPage: () => void
  build: (
    mode: 'search' | 'request'
  ) => SiteSearchResponse | SiteSearchRequested
}

export type WebEngineContainerContext = {
  engine: (engine: string) => string
  search: (ctx: WebEngineSearchRequest) => Promise<WebEngineContainerBuilder>
  request: (ctx: {
    route: string
    blog: AxiosInstance
    lexical: ({
      text,
      lineCount,
      pageUrl: lexicalAsPageHostingUrl,
    }: LexRankProps) => Promise<LexRankResponse>
  }) => Promise<WebEngineContainerBuilder>
  nextPage: () => void
  build: (
    mode: 'search' | 'request'
  ) => SiteSearchRequested | SiteSearchResponse
}

export type WebEngineContainer = () => WebEngineContainerContext

declare type RegistryContainerBody = {
  add: (name: string, value: string) => RegistryContainerBody
  loadFromFile: (directory: string) => void
  listAll: () => string[]
  query: (name: string) => string
}

declare type RegistryContainer = () => RegistryContainerBody
