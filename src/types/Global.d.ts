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
