import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { fetchFavs, getMoreFavs } from '../controllers'

import type { AccessToken } from '@spotify/web-api-ts-sdk'
import type { TimeRange } from '../types'

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
      body: z.undefined(),
      summary: 'Logout of Spotify'
    },
    fetchFavs: {
      method: 'POST',
      path: `/favs`,
      body: c.type<{ timeRange: TimeRange }>(),
      responses: {
        200: c.type<Awaited<ReturnType<typeof fetchFavs>>>()
      },
      summary: 'Fetch initial favourite genres'
    },
    getMoreFavs: {
      method: 'POST',
      path: '/get-more-favs',
      body: c.type<Parameters<typeof getMoreFavs>[0]>(),
      responses: {
        200: c.type<Awaited<ReturnType<typeof getMoreFavs>>>()
      },
      summary: 'Get more favourite genres'
    },
    createPlaylist: {
      method: 'POST',
      path: '/create-playlist',
      body: c.type<{
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
