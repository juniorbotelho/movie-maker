import * as GlobalType from '@Type/Global'

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

export type SiteModuleFunctionCallback = (
  response: GlobalType.SiteSearchResponse | GlobalType.SiteSearchRequested,
  nextPage: () => void
) => void

export type SiteModuleFunction = () => {
  search: (
    search: string,
    engine: string,
    fnCallback: SiteModuleFunctionCallback
  ) => Promise<void>
  request: (
    route: string,
    engine: string,
    fnCallback: SiteModuleFunctionCallback
  ) => Promise<void>
}
