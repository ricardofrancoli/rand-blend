import { onBeforeMount, ref } from 'vue'

import { client } from '@/client'
import { VITE_CLIENT_ID, VITE_REDIRECT_URI, VITE_API_BASE_URL } from '@/config'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import type { TimeRange } from '@rand-blend/api'

const isLoggedIn = ref(false)

export default function useSpotify() {
  const DEFAULT_TIME_RANGE = 'long_term' satisfies TimeRange

  const spotify = SpotifyApi.withUserAuthorization(VITE_CLIENT_ID, VITE_REDIRECT_URI)

  const timeRange = ref<TimeRange>(DEFAULT_TIME_RANGE)
  const favouriteGenres = ref<string[]>([])
  const requestedPopularity = ref(0)

  const handleIsLoggedIn = async () => {
    return !!(await spotify.getAccessToken())
  }

  onBeforeMount(async () => {
    isLoggedIn.value = await handleIsLoggedIn()
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

      isLoggedIn.value = await handleIsLoggedIn()
    } catch (err) {
      console.error(err)
    }

    if (!isLoggedIn.value) {
      throw new Error('No access token after login')
    }
  }

  const logout = async () => {
    if (!isLoggedIn.value) {
      throw new Error('No access token to log out')
    }

    await client.logout()
    spotify.logOut()

    isLoggedIn.value = false
    favouriteGenres.value = []
    requestedPopularity.value = 0
  }

  const isLoadingFavs = ref(false)

  const getFavs = async () => {
    if (!isLoggedIn.value) {
      return login()
    }

    isLoadingFavs.value = true

    const { body: favs, status } = await client.fetchFavs({
      body: { timeRange: timeRange.value }
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
    if (!isLoggedIn.value) {
      return login()
    }

    const { status } = await client.createPlaylist({
      body: {
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
    login,
    logout,
    getFavs,
    createPlaylist,
    DEFAULT_TIME_RANGE,
    timeRange,
    favouriteGenres,
    selectedGenres,
    isLoadingFavs,
    isLoggedIn
  }
}
