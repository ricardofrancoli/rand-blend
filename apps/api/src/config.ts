import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const config = z
  .object({
    CLIENT_ID: z.string(),
    PROD_APP_BASE_URL: z.string(),
    NODE_ENV: z.literal('production').or(z.literal('development')).or(z.literal('test'))
  })
  .parse(process.env)

const isProd = process.env.NODE_ENV === 'production'

export const APP_BASE_URL = isProd ? config.PROD_APP_BASE_URL : 'http://localhost:5173'
export const { CLIENT_ID, NODE_ENV } = config

export const EnvToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  production: true,
  test: false
} as const satisfies Record<typeof NODE_ENV, unknown>
