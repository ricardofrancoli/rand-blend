<script setup lang="ts">
import { SpotifyApi } from '@rand-blend/api'
const { VITE_CLIENT_ID = '', VITE_REDIRECT_URI = '' } = import.meta.env

const login = async () => {
  console.log(VITE_CLIENT_ID, VITE_REDIRECT_URI)

  const spotify = await SpotifyApi.performUserAuthorization(
    VITE_CLIENT_ID,
    VITE_REDIRECT_URI,
    ['user-read-private', 'user-read-email'],
    'http://localhost:3003/api/login'
  )

  console.dir({ spotify }, { depth: null })
}
</script>

<template>
  <main>
    <a @click="login"> LOGIN </a>
  </main>
</template>
