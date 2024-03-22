import { api } from './index'

try {
  await api.listen({ port: 3003 })
  console.log(`Listening on port ${3003}`)
} catch (err) {
  api.log.error(err)
  process.exit(1)
}
