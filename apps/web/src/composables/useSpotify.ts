import { onBeforeMount, ref } from 'vue'

import { client } from '@/client'
import { VITE_CLIENT_ID, VITE_REDIRECT_URI, VITE_API_BASE_URL } from '@/config'
import { SpotifyApi, type AccessToken } from '@spotify/web-api-ts-sdk'

import type { TimeRange } from '@rand-blend/api'

const isLoggedIn = ref(false)

export default function useSpotify() {
  const DEFAULT_TIME_RANGE = 'long_term' satisfies TimeRange

  const accessToken = ref<AccessToken | null>(null)
  const timeRange = ref<TimeRange>(DEFAULT_TIME_RANGE)
  const favouriteGenres = ref<string[]>([])
  const requestedPopularity = ref(0)

  const handleAccessToken = async () => {
    const accessToken = await spotify.getAccessToken()

    return accessToken
  }

  onBeforeMount(async () => {
    accessToken.value = await handleAccessToken()
    isLoggedIn.value = !!accessToken.value
  })

  const login = async () => {
    try {
      const postBackUrl = `${VITE_API_BASE_URL}/api/login`

      await SpotifyApi.performUserAuthorization(
        VITE_CLIENT_ID,
        VITE_REDIRECT_URI,
        ['user-read-private', 'user-read-email', 'user-top-read', 'playlist-modify-private'],
        postBackUrl
      )

      accessToken.value = await handleAccessToken()
    } catch (err) {
      console.error(err)
    }

    if (!accessToken.value) {
      throw new Error('No access token after login')
    }
  }

  const spotify = SpotifyApi.withUserAuthorization(VITE_CLIENT_ID, VITE_REDIRECT_URI)

  const logout = async () => {
    if (!accessToken.value) {
      throw new Error('No access token to log out')
    }

    await client.logout({ body: accessToken.value })
    spotify.logOut()

    accessToken.value = null
    favouriteGenres.value = []
    requestedPopularity.value = 0
  }

  const isLoadingFavs = ref(false)

  const getFavs = async () => {
    if (!accessToken.value) {
      return login()
    }

    isLoadingFavs.value = true

    const { body: favs, status } = await client.getFavs({
      body: { accessToken: accessToken.value, timeRange: timeRange.value }
    })

    if (status !== 200) {
      isLoadingFavs.value = false
      throw new Error('Failed to get favs')
    }

    const { uniqueGenres, popularityAverage } = favs

    favouriteGenres.value = uniqueGenres
    requestedPopularity.value = popularityAverage
    isLoadingFavs.value = false
  }

  const selectedGenres = ref<string[]>([])
  const createPlaylist = async (playlistName: string) => {
    if (!accessToken.value) {
      return login()
    }

    const { status } = await client.createPlaylist({
      body: {
        accessToken: accessToken.value,
        genres: selectedGenres.value,
        playlistName,
        requestedPopularity: requestedPopularity.value
      }
    })

    if (status !== 201) {
      throw new Error('Failed to create playlist')
    }
  }

  return {
    isLoggedIn,
    accessToken,
    login,
    logout,
    getFavs,
    createPlaylist,
    DEFAULT_TIME_RANGE,
    timeRange,
    favouriteGenres,
    selectedGenres,
    isLoadingFavs
  }
}
