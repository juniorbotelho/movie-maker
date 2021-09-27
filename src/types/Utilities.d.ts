export type RuleSave = {
  maximumSentences?: number
  searchTerm: string
  prefix: string
  sourceContentOriginal?: string
  sourceContentSanitized?: string
  sentences?: [
    {
      text: string
      keywords: string[]
      images: string[]
    }
  ]
}
