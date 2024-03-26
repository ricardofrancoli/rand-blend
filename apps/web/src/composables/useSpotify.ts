import { ref } from 'vue'

import { client } from '@/client'
import { SpotifyApi } from '@rand-blend/api'

const { VITE_CLIENT_ID = '', VITE_REDIRECT_URI = '' } = import.meta.env

export default function useSpotify() {
  if (!VITE_CLIENT_ID || !VITE_REDIRECT_URI) {
    throw new Error('Missing environment variables')
  }

  const login = async () => {
    return SpotifyApi.performUserAuthorization(
      VITE_CLIENT_ID,
      VITE_REDIRECT_URI,
      ['user-read-private', 'user-read-email', 'user-top-read', 'playlist-modify-private'],
      'http://localhost:3003/api/login'
    )
  }

  const spotify = SpotifyApi.withUserAuthorization(VITE_CLIENT_ID, VITE_REDIRECT_URI)

  const handleAccessToken = async () => {
    const accessToken = await spotify.getAccessToken()

    console.log('accessToken', accessToken)

    return accessToken
  }

  const logout = async () => {
    const accessToken = await handleAccessToken()

    if (!accessToken) {
      throw new Error('No access token')
    }

    spotify.logOut()
    return client.logout({ body: accessToken })
  }

  const favouriteGenres = ref<string[]>([])
  const requestedPopularity = ref(0)
  const getFavs = async () => {
    const accessToken = await handleAccessToken()

    if (!accessToken) {
      console.log('No access token')

      return login()
    }

    const { body: favs, status } = await client.getFavs({ body: accessToken })

    if (status !== 200) {
      throw new Error('Failed to get favs')
    }

    const { uniqueGenres, popularityAverage } = favs

    favouriteGenres.value = uniqueGenres
    requestedPopularity.value = popularityAverage
  }

  const selectedGenres = ref<string[]>([])
  const createPlaylist = async () => {
    const accessToken = await handleAccessToken()

    if (!accessToken) {
      console.log('No access token')

      return login()
    }

    const { body: playlist, status } = await client.createPlaylist({
      body: {
        accessToken,
        genres: selectedGenres.value,
        playlistName: Math.random().toString(),
        requestedPopularity: requestedPopularity.value
      }
    })

    if (status !== 201) {
      throw new Error('Failed to create playlist')
    }

    console.log('playlist', playlist)
  }

  return {
    login,
    logout,
    getFavs,
    createPlaylist,
    favouriteGenres,
    selectedGenres
  }
}
