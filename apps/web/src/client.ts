import { initClient } from '@ts-rest/core'
import { contract } from '@rand-blend/api'

export const client = initClient(contract, {
  baseUrl: 'http://localhost:3003',
  baseHeaders: {}
})
