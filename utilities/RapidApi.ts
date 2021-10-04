import Axios from 'axios'
import * as Environment from '@App/Environment'

type RapidRewriterMethodResponse = {
  rewrite: string
  similarity: number
}

type RapidSummarizationMethodResponse = {
  summary: string
}

type RapidAPIModuleFunction = () => {
  rewriter: (data: {
    language: string
    strength: 1 | 2 | 3
    text: string
  }) => Promise<RapidRewriterMethodResponse>

  summarization: (data: {
    text: string
    num_sentences: number
  }) => Promise<RapidSummarizationMethodResponse>
}

const Wrapper: RapidAPIModuleFunction = () => ({
  rewriter: async (data) => {
    const api = Axios.create({
      baseURL: Environment.ENV.RapidApi().rewriter.url,
      timeout: 30000,
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': Environment.ENV.RapidApi().rewriter.host,
        'x-rapidapi-key': Environment.ENV.RapidApi().apiKey,
      },
    })

    const response = await api.post<RapidRewriterMethodResponse>('/', data)

    return response.data
  },
  summarization: async (data) => {
    const api = Axios.create({
      baseURL: Environment.ENV.RapidApi().summarization.url,
      timeout: 30000,
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': Environment.ENV.RapidApi().summarization.host,
        'x-rapidapi-key': Environment.ENV.RapidApi().apiKey,
      },
    })

    const response = await api.post<RapidSummarizationMethodResponse>('/', data)

    return response.data
  },
})

export const Context = Wrapper()
