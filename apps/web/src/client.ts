import { initClient } from '@ts-rest/core'
import { contract } from '../../api/src'

export const client = initClient(contract, {
  baseUrl: 'http://localhost:3003',
  baseHeaders: {}
})
