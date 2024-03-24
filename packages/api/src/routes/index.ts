import Fastify from 'fastify'
import cors from '@fastify/cors'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify'

import { createContext } from './context'
import { appRouter, type AppRouter } from './router'

export const app = Fastify({
  logger: true
})

const { CLIENT_ID = '' } = process.env

app
  .register(cors, {
    origin: 'http://localhost:5173',
    credentials: true
  })
  .register(fastifyTRPCPlugin, {
    prefix: '/api',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        console.error(`Error in tRPC handler on path '${path}':`, error)
      }
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions']
  })

app.post('/api/login', async (req, reply) => {
  const data = req.body

  // TODO: type-check data
  const spotifySdk = SpotifyApi.withAccessToken(CLIENT_ID, data as any)

  console.dir({ spotifySdk }, { depth: null })
})
