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

export type SiteModuleFunction = () => {
  search: (search: string, engine: string) => Promise<void>
  request: (route: string, engine: string) => Promise<void>
}
