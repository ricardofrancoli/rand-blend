import type { SpotifyApi } from '@spotify/web-api-ts-sdk'
import type { TimeRange } from '../../types'

export type UniqueArtistIds = Set<string>

export type FetchFavsParams = {
  spotifySdk: SpotifyApi
  timeRange: TimeRange
}
