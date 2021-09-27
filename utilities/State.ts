import * as FileSystem from 'fs'
import * as Path from 'path'
import { RuleSave } from '@Type/Utilities'

const content = Path.resolve('temp/content.json')
const scripting = Path.resolve('temp/script.js')

const Wrapper = () => ({
  save: (rules: RuleSave) => {
    const rulesAsJSON = JSON.stringify(rules)
    return FileSystem.writeFileSync(content, rulesAsJSON)
  },
  saveScript: (rules: RuleSave) => {
    const rulesAsJS = JSON.stringify(rules)
    const script = 'var content = {value}'.replace('{value}', rulesAsJS)
    return FileSystem.writeFileSync(scripting, script)
  },
  load: () => {
    const buffer = FileSystem.readFileSync(content, 'UTF-8')
    return JSON.parse(buffer)
  },
})

export const Context = Wrapper()
