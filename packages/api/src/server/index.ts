import { app } from '../routes'

try {
  await app.listen({ port: 3003 })
  console.log(`Listening on port ${3003}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
