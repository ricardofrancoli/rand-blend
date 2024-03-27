import Fastify from 'fastify'
import cors from '@fastify/cors'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { initServer } from '@ts-rest/fastify'

import { createPlaylist, getFavs } from '../controllers'
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

    return {
      status: 201,
      body: 'Logged in!'
    }
  },
  logout: async ({ body: accessToken }) => {
    const spotify = SpotifyApi.withAccessToken(CLIENT_ID, accessToken)

    spotify.logOut()

    return {
      status: 201,
      body: 'Logged out!'
    }
  },
  getFavs: async ({ body: { accessToken, timeRange } }) => {
    const favs = await getFavs({ accessToken, timeRange })

    return {
      status: 200,
      body: favs
    }
  },
  createPlaylist: async ({ body: { accessToken, genres, playlistName, requestedPopularity } }) => {
    try {
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
