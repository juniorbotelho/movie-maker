import * as Deepai from 'deepai'

type DeepaiImageSimilarResponse = {
  id: string
  output: {
    distance: number
  }
}

type DeepaiModuleFunction = () => {
  imageSimilarity: (
    original: string,
    compare: string
  ) => Promise<DeepaiImageSimilarResponse>
}

const Wrapper: DeepaiModuleFunction = () => ({
  imageSimilarity: async (original, compare) => {
    Deepai.setApiKey('') // TODO: add credential to deepai service

    const response = await Deepai.callStandardApi('image-similarity', {
      image1: original,
      image2: compare,
    })

    return response
  },
})

export const Context = Wrapper()
