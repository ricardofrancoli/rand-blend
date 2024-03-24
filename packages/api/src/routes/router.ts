import { initTRPC } from '@trpc/server'
import { z } from 'zod'

import { getFavs } from '../controllers/index'

const t = initTRPC.create()
const publicProcedure = t.procedure

export const appRouter = t.router({
  ping: publicProcedure.query(() => {
    return 'hi'
  }),
  getFavs: publicProcedure.query(async () => {
    const favs = await getFavs()

    return favs
  })
})

export type AppRouter = typeof appRouter
