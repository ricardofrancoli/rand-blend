import z from 'zod'

const config = z
  .object({
    DEV_APP_BASE_URL: z.string(),
    CLIENT_ID: z.string(),
    PROD_APP_BASE_URL: z.string(),
    REDIRECT_URI: z.string()
  })
  .parse(process.env)

const isProd = process.env.NODE_ENV === 'production'

export const APP_BASE_URL = isProd ? config.PROD_APP_BASE_URL : config.DEV_APP_BASE_URL
export const { CLIENT_ID, REDIRECT_URI } = config
