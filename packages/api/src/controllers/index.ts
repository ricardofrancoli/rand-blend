import pMap from 'p-map'
import { SpotifyApi, type AccessToken, type Market, type Track } from '@spotify/web-api-ts-sdk'

import { CLIENT_ID } from '../config'

type GenreTrack = {
  popularity: number
  name: string | undefined
  trackName: string
  trackId: string
  trackUri: string
}

const TRACKS_TO_FETCH = 20
const MAX_OFFSET = TRACKS_TO_FETCH * 1000

const initialiseSpotifySdk = (accessToken: AccessToken) => {
  const spotifySdk = SpotifyApi.withAccessToken(CLIENT_ID, accessToken)

  console.dir({ currAccessToken: accessToken, retrievedSpotifySdk: spotifySdk }, { depth: null })

  return spotifySdk
}

const getTracksByGenre = async ({
  spotifySdk,
  genres,
  country,
  offset
}: {
  spotifySdk: SpotifyApi
  genres: string[]
  country: string
  offset: number
}) => {
  const tracksByGenre: Record<string, GenreTrack[]> = {}

  try {
    await pMap(
      genres,
      async (genre) => {
        const trackItemsInGenre = (
          await spotifySdk.search(
            `genre:${genre}`,
            ['track'],
            country as Market,
            TRACKS_TO_FETCH,
            offset
          )
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

    return tracksByGenre
  } catch (err) {
    console.error(err)

    const errorMessage = err instanceof Error ? err.message : 'Unknown error'

    throw new Error('Failed to get tracks by genre', { cause: errorMessage })
  }
}

const calculateTopAndBottomPopularity = (requestedPopularity: number, offset: number) => {
  // If we've fetched 20 times or more, forget about averages and just get any track
  if (offset >= TRACKS_TO_FETCH * 20) {
    return { bottomPopularity: 0, topPopularity: 100 }
  }

  const bottomPopularity = requestedPopularity * 0.5
  const topPopularity = requestedPopularity * 1.5

  return { bottomPopularity, topPopularity }
}

const getRandomTrackUris = async ({
  spotifySdk,
  genres,
  country,
  requestedPopularity,
  offset = 0,
  randomTrackUris = []
}: {
  spotifySdk: SpotifyApi
  genres: string[]
  country: string
  requestedPopularity: number
  offset: number
  randomTrackUris: string[]
}): Promise<string[]> => {
  const tracksByGenre = await getTracksByGenre({ spotifySdk, genres, country, offset })

  for (const tracks of Object.values(tracksByGenre)) {
    const { bottomPopularity, topPopularity } = calculateTopAndBottomPopularity(
      requestedPopularity,
      offset
    )

    const tracksInPopularityRange = tracks.filter(
      (track) => track.popularity >= bottomPopularity && track.popularity <= topPopularity
    )

    if (tracksInPopularityRange.length > 0) {
      const randomTrack =
        tracksInPopularityRange[Math.floor(Math.random() * tracksInPopularityRange.length)]

      if (randomTrack) {
        randomTrackUris.push(randomTrack.trackUri)
      }
    }
  }

  if (offset >= MAX_OFFSET) {
    throw new Error('Failed to fetch enough tracks')
  }

  if (randomTrackUris.length >= 30) {
    return randomTrackUris
  }

  return getRandomTrackUris({
    spotifySdk,
    genres,
    country,
    requestedPopularity,
    offset: offset + TRACKS_TO_FETCH,
    randomTrackUris
  })
}

export const createPlaylist = async ({
  accessToken,
  genres,
  playlistName,
  requestedPopularity
}: {
  accessToken: AccessToken
  genres: string[]
  playlistName: string
  requestedPopularity: number
}) => {
  const spotifySdk = initialiseSpotifySdk(accessToken)

  const { id: userId, country } = await spotifySdk.currentUser.profile()

  const randomTrackUris = await getRandomTrackUris({
    spotifySdk,
    genres,
    country,
    requestedPopularity,
    offset: 0,
    randomTrackUris: []
  })

  const newPlaylist = await spotifySdk.playlists.createPlaylist(userId, {
    name: playlistName,
    description: 'test',
    public: false
  })
  await spotifySdk.playlists.addItemsToPlaylist(newPlaylist.id, randomTrackUris)

  console.dir({ newPlaylist, playlistName }, { depth: null })
}

export const getFavs = async (accessToken: AccessToken) => {
  const spotifySdk = initialiseSpotifySdk(accessToken)

  const topTracks = await spotifySdk.currentUser.topItems('tracks', 'long_term', 50)

  const artistIds: string[] = []
  const trackPopularities: number[] = []
  topTracks.items.forEach((track) => {
    trackPopularities.push(track.popularity)

    const artistId = track.artists[0]?.id

    if (!artistId) {
      return
    }

    artistIds.push(artistId)
  })

  const popularityAverage = trackPopularities.reduce((a, b) => a + b, 0) / trackPopularities.length

  const artists = await spotifySdk.artists.get(artistIds)
  const genres = artists.flatMap((artist) => artist.genres)

  const uniqueGenres = Array.from(new Set(genres))

  return { uniqueGenres, popularityAverage }
}
