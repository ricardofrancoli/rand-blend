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
      ['user-read-private', 'user-read-email', 'user-top-read'],
      'http://localhost:3003/api/login'
    )
  }

  const spotify = SpotifyApi.withUserAuthorization(VITE_CLIENT_ID, VITE_REDIRECT_URI)

  const handleAccessToken = async () => {
    // // const test = await trpc.getFavs.query()
    // // console.log('test', test)
    // const spotify = SpotifyApi.withUserAuthorization(VITE_CLIENT_ID, VITE_REDIRECT_URI)
    // console.log(await spotify.getAccessToken())
    // const getFavs = async () => {
    //   console.dir({ getFavsSpotifyNu: spotify }, { depth: null })
    //   const tracks = await spotify.currentUser.topItems('tracks')
    //   console.dir({ tracks }, { depth: null })
    //   return tracks
    // }
    // const yes = await getFavs()
    // console.log('yes', yes)

    const accessToken = await spotify.getAccessToken()

    console.log('accessToken', accessToken)

    return accessToken
  }

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

    console.log('favs', favs)

    return favs
  }

  return {
    login,
    getFavs
  }
}
