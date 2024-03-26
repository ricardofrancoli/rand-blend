import pMap from 'p-map'
import { SpotifyApi, type AccessToken, type Market, type Track } from '@spotify/web-api-ts-sdk'

import { CLIENT_ID, REDIRECT_URI } from '../config'

type GenreTrack = {
  popularity: number
  name: string | undefined
  trackName: string
  trackId: string
  trackUri: string
}

const initialiseSpotifySdk = (accessToken: AccessToken) => {
  const spotifySdk = SpotifyApi.withAccessToken(CLIENT_ID, accessToken)

  console.dir({ currAccessToken: accessToken, retrievedSpotifySdk: spotifySdk }, { depth: null })

  return spotifySdk
}

export const createPlaylist = async ({
  accessToken,
  genres
}: {
  accessToken: AccessToken
  genres: string[]
}) => {
  const spotifySdk = initialiseSpotifySdk(accessToken)

  const { id: userId, country } = await spotifySdk.currentUser.profile()

  console.dir({ genres }, { depth: null })

  const tracksByGenre: Record<string, GenreTrack[]> = {}
  await pMap(
    genres,
    async (genre) => {
      const trackItemsInGenre = (
        await spotifySdk.search(`genre:${genre}`, ['track'], country as Market, 20)
      ).tracks.items

      tracksByGenre[genre] = trackItemsInGenre.map((item) => {
        return {
          popularity: item.popularity,
          name: item.artists[0]?.name,
          trackName: item.name,
          trackId: item.id,
          trackUri: item.uri
        }
      })
    },
    { concurrency: 5 }
  )

  const test = await spotifySdk.playlists.createPlaylist(userId, {
    name: 'test',
    description: 'test',
    public: false
  })

  const randomTrackUris: string[] = []
  Object.entries(tracksByGenre).forEach(([_, tracks]) => {
    const popularishTracks = tracks.filter((track) => track.popularity > 15)

    if (popularishTracks.length === 0) {
      return
    }

    const randomTrack = popularishTracks[Math.floor(Math.random() * popularishTracks.length)]

    if (randomTrack) {
      console.log('randomTrack.trackId', randomTrack.trackUri)

      randomTrackUris.push(randomTrack.trackUri)
    }
  })

  await spotifySdk.playlists.addItemsToPlaylist(test.id, randomTrackUris)

  console.dir({ tracksByGenre, test }, { depth: null })
}

export const getFavs = async (accessToken: AccessToken) => {
  const spotifySdk = initialiseSpotifySdk(accessToken)

  const [topTracks, { id: userId, country }] = await Promise.all([
    spotifySdk.currentUser.topItems('tracks', 'long_term', 50),
    spotifySdk.currentUser.profile()
  ])

  const artistIds: string[] = []
  topTracks.items.forEach((track) => {
    const artistId = track.artists[0]?.id

    if (!artistId) {
      return
    }

    artistIds.push(artistId)
  })

  const artists = await spotifySdk.artists.get(artistIds)
  const genres = artists.flatMap((artist) => artist.genres)

  console.dir({ genres, totGenres: genres.length }, { depth: null })

  // await createPlaylist({ spotifySdk, genres, country, userId })

  const uniqueGenres = Array.from(new Set(genres))

  return uniqueGenres
}
