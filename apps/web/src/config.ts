import z from 'zod'

export const config = z
  .object({
    VITE_CLIENT_ID: z.string(),
    VITE_REDIRECT_URI: z.string(),
    VITE_API_BASE_URL: z.string()
  })
  .parse(import.meta.env)

export const { VITE_CLIENT_ID, VITE_REDIRECT_URI, VITE_API_BASE_URL } = config
