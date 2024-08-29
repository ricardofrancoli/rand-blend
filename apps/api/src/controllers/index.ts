import pMap from 'p-map'
import { handleErrorMessage } from '@rand-blend/utils'
import {
  SpotifyApi,
  type AccessToken,
  type Artist,
  type Market,
  type Track
} from '@spotify/web-api-ts-sdk'

import { CLIENT_ID } from '../config'

import type { GenreTrack, TimeRange } from '../types'

const TRACKS_TO_FETCH = 20
const MAX_OFFSET = TRACKS_TO_FETCH * 1000

const initialiseSpotifySdk = (accessToken: AccessToken) => {
  const spotifySdk = SpotifyApi.withAccessToken(CLIENT_ID, accessToken)

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
        const fetchTracksInGenre = async () => {
          return spotifySdk.search(
            `genre:${genre}`,
            ['track'],
            country as Market,
            TRACKS_TO_FETCH,
            offset
          )
        }

        const {
          tracks: { items: trackItemsInGenre }
        } = await fetchTracksInGenre()

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
    const errorMessage = handleErrorMessage(err, 'Failed to get tracks by genre')

    throw new Error(errorMessage)
  }
}

const calculateTopAndBottomPopularity = (requestedPopularity: number, offset: number) => {
  // Slightly increase the bottom and top popularity the more tracks we've fetched
  const averagePopularity = (requestedPopularity * 5) / 100
  const popularityOffset = Math.floor(averagePopularity * (offset / TRACKS_TO_FETCH))

  // If we've fetched 20 times or more, forget about averages and just get any track
  if (offset >= TRACKS_TO_FETCH * 20) {
    return { bottomPopularity: 0, topPopularity: 100 }
  }

  const bottomPopularity = requestedPopularity - popularityOffset
  const topPopularity = requestedPopularity + popularityOffset * 2

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
}

const fetchTopTracks = async ({
  spotifySdk,
  timeRange
}: {
  spotifySdk: SpotifyApi
  timeRange: TimeRange
}) => {
  const BATCH_SIZE = 50
  const MAX_BATCHES = 10
  const TARGET_UNIQUE_ARTISTS = 150

  const tracks: Track[] = []
  const uniqueArtistIds = new Set<string>()

  await pMap(
    Array(MAX_BATCHES),
    async (_, i) => {
      // Check if we have enough unique artists
      if (uniqueArtistIds.size >= TARGET_UNIQUE_ARTISTS) {
        return
      }

      const offset = i * BATCH_SIZE

      const topTracksBatch = await spotifySdk.currentUser.topItems(
        'tracks',
        timeRange,
        BATCH_SIZE,
        offset
      )

      tracks.push(...topTracksBatch.items)

      // Add artist ids to the set
      topTracksBatch.items.forEach((track) => {
        track.artists.forEach((artist) => uniqueArtistIds.add(artist.id))
      })
    },
    { concurrency: MAX_BATCHES }
  )

  return {
    uniqueArtistIds,
    uniqueArtistCount: uniqueArtistIds.size,
    tracks
  }
}

export const getFavs = async ({
  accessToken,
  timeRange
}: {
  accessToken: AccessToken
  timeRange: TimeRange
}) => {
  const spotifySdk = initialiseSpotifySdk(accessToken)

  const { uniqueArtistIds, tracks } = await fetchTopTracks({ spotifySdk, timeRange })

  const trackPopularities = tracks.map((track) => track.popularity)
  const popularityAverage = trackPopularities.reduce((a, b) => a + b, 0) / trackPopularities.length

  const artistPromises: Promise<Artist>[] = Array.from(uniqueArtistIds)
    // TODO: make this slice dynamic and larger with a new param from the frontend. Getting rate limits otherwise
    .slice(0, 5)
    .map((artists) => spotifySdk.artists.get(artists))

  const artistsRes = await Promise.all(artistPromises)
  const genres = artistsRes.flatMap((artist) => artist.genres)

  const uniqueGenres = Array.from(new Set(genres))

  return { uniqueGenres, popularityAverage }
}
