import type { SpotifyApi } from '@spotify/web-api-ts-sdk'

export type TimeRange = Parameters<typeof SpotifyApi.prototype.currentUser.topItems>['1']

export type GenreTrack = {
  popularity: number
  name: string | undefined
  trackName: string
  trackId: string
  trackUri: string
}
