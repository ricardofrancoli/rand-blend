import { app } from '../routes'
const host = 'RENDER' in process.env ? `0.0.0.0` : `localhost`

try {
  await app.listen({ port: 3003, host })
  console.log(`Listening on port ${3003}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
