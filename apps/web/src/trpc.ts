import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@rand-blend/api'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3003/api'
    })
  ]
})
