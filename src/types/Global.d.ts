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
  sourceContentOriginal?: string
  sourceContentSanitized?: string
  sentences?: StateSentence[]
}
