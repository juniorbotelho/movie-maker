import * as Main from '@App/Main'
import * as Express from 'express'
import * as Http from 'http'

Main.Application(async ({ ctx }) => {
  const express = Express()

  express.use(Express.static('public'))

  const server = Http.createServer(express)

  server.listen(3000, () => ctx.logger.info('🚀 Loaded: Server'))
})
