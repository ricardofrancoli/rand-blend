import Fastify from 'fastify'

import type { FastifyRequest } from 'fastify'

export const api = Fastify({
  logger: true
})

api.get('/api/ping', async () => {
  return 'hi'
})
