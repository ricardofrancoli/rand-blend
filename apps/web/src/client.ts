import { initClient } from '@ts-rest/core'
import { contract } from '@rand-blend/api'
import { VITE_API_BASE_URL } from '@/config'

export const client = initClient(contract, {
  baseUrl: VITE_API_BASE_URL,
  baseHeaders: {}
})
