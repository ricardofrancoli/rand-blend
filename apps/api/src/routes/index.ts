import Fastify from 'fastify'
import cors from '@fastify/cors'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { initServer } from '@ts-rest/fastify'

import { APP_BASE_URL, CLIENT_ID } from '../config'
import { createPlaylist, getFavs } from '../controllers'
import { contract } from './contract'

export const app = Fastify({
  logger: true
})
const s = initServer()

app.register(cors, {
  origin: APP_BASE_URL,
  credentials: true
})

let spotify: SpotifyApi | undefined

const router = s.router(contract, {
  ping: async () => {
    return {
      status: 200,
      body: 'hi'
    }
  },
  login: async ({ body: accessToken }) => {
    spotify = SpotifyApi.withAccessToken(CLIENT_ID, accessToken)

    return {
      status: 201,
      body: 'Logged in!'
    }
  },
  logout: async () => {
    spotify?.logOut()

    return {
      status: 201,
      body: 'Logged out!'
    }
  },
  getFavs: async ({ body: { timeRange } }) => {
    const accessToken = await spotify?.getAccessToken()

    if (!accessToken) {
      throw new Error('No access token to get favs')
    }

    const favs = await getFavs({ accessToken, timeRange })

    return {
      status: 200,
      body: favs
    }
  },
  createPlaylist: async ({ body: { genres, playlistName, requestedPopularity } }) => {
    try {
      const accessToken = await spotify?.getAccessToken()

      if (!accessToken) {
        throw new Error('No access token to create playlist')
      }

      await createPlaylist({ accessToken, genres, playlistName, requestedPopularity })
    } catch (err) {
      console.error(err)
    }

    return {
      status: 201,
      body: 'Playlist created!'
    }
  }
})

app.register(s.plugin(router))
