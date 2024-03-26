import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { getFavs } from '../controllers'

import type { AccessToken } from '@spotify/web-api-ts-sdk'

const c = initContract()

export const contract = c.router(
  {
    ping: {
      method: 'GET',
      path: '/ping',
      responses: {
        200: z.string()
      },
      summary: 'Ping the server'
    },
    login: {
      method: 'POST',
      path: '/login',
      responses: {
        201: z.string()
      },
      body: c.type<AccessToken>(),
      summary: 'Login to Spotify'
    },
    logout: {
      method: 'POST',
      path: '/logout',
      responses: {
        201: z.string()
      },
      body: c.type<AccessToken>(),
      summary: 'Logout of Spotify'
    },
    getFavs: {
      method: 'POST',
      path: `/favs`,
      body: c.type<AccessToken>(),
      responses: {
        200: c.type<Awaited<ReturnType<typeof getFavs>>>()
      },
      summary: 'Get favourite genres'
    },
    createPlaylist: {
      method: 'POST',
      path: '/create-playlist',
      body: c.type<{
        accessToken: AccessToken
        genres: string[]
        playlistName: string
        requestedPopularity: number
      }>(),
      responses: {
        201: z.string()
      },
      summary: 'Create a playlist'
    }
  },
  {
    pathPrefix: '/api'
  }
)
