import pMap from 'p-map'
import { type SpotifyApi, type Artist, type Track } from '@spotify/web-api-ts-sdk'

import type { FetchFavsParams, UniqueArtistIds } from './types'

const getArtists = async ({
  spotifySdk,
  uniqueArtistIds,
  slicerBatch = 0
}: {
  spotifySdk: SpotifyApi
  uniqueArtistIds: UniqueArtistIds
  slicerBatch?: number
}) => {
  const MAX_ARTISTS = 50
  const slicerIndexStart = slicerBatch * MAX_ARTISTS
  const slicerIndexEnd = slicerIndexStart + MAX_ARTISTS

  const artistPromises: Promise<Artist>[] = Array.from(uniqueArtistIds)
    .slice(slicerIndexStart, slicerIndexEnd)
    .map((artists) => spotifySdk.artists.get(artists))

  return Promise.all(artistPromises)
}

const getUniqueGenres = ({ artists }: { artists: Artist[] }) => {
  const genres = artists.flatMap((artist) => artist.genres)

  const uniqueGenres = Array.from(new Set(genres))

  return uniqueGenres
}

const fetchTopTracks = async ({ spotifySdk, timeRange }: FetchFavsParams) => {
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

export const fetchFavs = async ({ spotifySdk, timeRange }: FetchFavsParams) => {
  const { uniqueArtistIds, tracks } = await fetchTopTracks({ spotifySdk, timeRange })

  const trackPopularities = tracks.map((track) => track.popularity)
  const popularityAverage = trackPopularities.reduce((a, b) => a + b, 0) / trackPopularities.length

  const artists = await getArtists({ spotifySdk, uniqueArtistIds })
  const uniqueGenres = getUniqueGenres({ artists })

  return { uniqueGenres, popularityAverage }
}

export const getMoreFavs = async ({ uniqueArtistIds }: { uniqueArtistIds: UniqueArtistIds }) => {
  // TODO: obvs this is wrong, we need to globally import the spotify sdk
  const artists = await getArtists({ uniqueArtistIds, spotifySdk: {} as SpotifyApi })
  const uniqueGenres = getUniqueGenres({ artists })

  return { uniqueGenres }
}
