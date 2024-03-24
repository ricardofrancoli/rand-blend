import Fastify from 'fastify'
import cors from '@fastify/cors'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

export const app = Fastify({
  logger: true
})

const { CLIENT_ID = '' } = process.env

app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true
})

app.get('/api/ping', async () => {
  return 'hi'
})

app.post('/api/login', async (req, reply) => {
  const data = req.body

  // TODO: type-check data
  const spotifySdk = SpotifyApi.withAccessToken(CLIENT_ID, data as any)

  console.dir({ spotifySdk }, { depth: null })
})
