export type StateSentence = {
  text: string
  keywords: string[]
  images: string[]
  googleSearchQuery?: string
}

export type RuleState = {
  maximumSentences?: number
  searchTerm: string
  prefix: string
  downloadedImages?: string[]
  sourceContentOriginal?: string
  sourceContentSanitized?: string
  sentences?: StateSentence[]
}

type ImageDownloader = {
  url: string
  directory: string
  name?: string
}
