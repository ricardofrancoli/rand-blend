<script setup lang="ts">
import { useRouter } from 'vue-router'
import useSpotify from '@/composables/useSpotify'

const { accessToken, login } = useSpotify()

await login()

console.log('after login', accessToken.value)

const router = useRouter()
router.go(-1)
</script>

<template>
  <div>Logged in</div>
</template>
