import PptxGenJS from 'pptxgenjs'

const Powerpoint = require('pptxgenjs')

type PowerPointModuleFunction = () => PptxGenJS

const Wrapper: PowerPointModuleFunction = () => new Powerpoint()

export const Context = Wrapper()
