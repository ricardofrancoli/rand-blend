import Fastify from 'fastify'
import cors from '@fastify/cors'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { initServer } from '@ts-rest/fastify'

import { getFavs } from '../controllers'
import { contract } from './contract'

const { CLIENT_ID = '' } = process.env

export const app = Fastify({
  logger: true
})
const s = initServer()

app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true
})

const router = s.router(contract, {
  ping: async () => {
    return {
      status: 200,
      body: 'hi'
    }
  },
  login: async ({ body: accessToken }) => {
    const spotify = SpotifyApi.withAccessToken(CLIENT_ID, accessToken)

    console.dir({ spotify }, { depth: null })

    return {
      status: 201,
      body: 'Logged in!'
    }
  },
  getFavs: async ({ body: accessToken }) => {
    console.dir({ what222: accessToken }, { depth: null })

    const favs = await getFavs(accessToken)

    return {
      status: 200,
      body: favs
    }
  }
})

app.register(s.plugin(router))
