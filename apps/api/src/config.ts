import z from 'zod'

const config = z
  .object({
    CLIENT_ID: z.string(),
    PROD_APP_BASE_URL: z.string()
  })
  .parse(process.env)

const isProd = process.env.NODE_ENV === 'production'

export const APP_BASE_URL = isProd ? config.PROD_APP_BASE_URL : 'http://localhost:5173'
export const { CLIENT_ID } = config
