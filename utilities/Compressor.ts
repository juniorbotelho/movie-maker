import * as Crypto from 'crypto'
import * as Child from 'child_process'
import * as FileSystem from 'fs'

export type CompressorModuleFunction = () => {
  compress: (args: {
    id: string
    files: string[]
    storage?: any
    engine?: any
  }) => void
  extract: () => void
}

export type RefFile = {
  references: {
    id: string
    name: string
    quantityFilesRoot?: number
  }[]
}

// TODO: Remember to finish this utility to deal with various files coming from the internet.
const Wrapper: CompressorModuleFunction = () => ({
  compress: ({ id, files }) => {
    const uniqueId = Buffer.from(id, 'base64')
    const uniqueHash = Crypto.createHash('md5').update(uniqueId).digest('hex')
    const directory = 'temp/'.concat(uniqueHash)

    /**
     *
     */
    if (!FileSystem.existsSync('temp/references.json')) {
      FileSystem.writeFileSync('temp/references.json', {
        references: [],
      })
    }

    /**
     *
     */
    files.forEach((file) => {
      if (FileSystem.existsSync(file)) {
        FileSystem.mkdirSync(directory)
        FileSystem.renameSync(file, directory)

        const reference = FileSystem.readFileSync('temp/references.json')
        const refFile: RefFile = JSON.parse(reference.toString())

        Child.execSync(`zip -r ${uniqueHash}.zip ${directory}`)

        refFile.references.push({
          id: uniqueHash,
          name: uniqueId.toString(),
        })
      }
    })
  },
  extract: () => null,
})

export const Context = Wrapper()
