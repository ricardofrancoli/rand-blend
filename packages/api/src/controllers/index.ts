import { SpotifyApi, type AccessToken } from '@spotify/web-api-ts-sdk'

import { CLIENT_ID, REDIRECT_URI } from '../config'

const initialiseSpotifySdk = (accessToken: AccessToken) => {
  const spotifySdk = SpotifyApi.withAccessToken(CLIENT_ID, accessToken)

  console.dir({ currAccessToken: accessToken, retrievedSpotifySdk: spotifySdk }, { depth: null })

  return spotifySdk
}

export const getFavs = async (accessToken: AccessToken) => {
  const spotifySdk = initialiseSpotifySdk(accessToken)

  const tracks = await spotifySdk.currentUser.topItems('tracks')

  return tracks
}
