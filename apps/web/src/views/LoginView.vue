<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import useSpotify from '@/composables/useSpotify'
import { Spinner } from '@/components/ui/spinner'

const { accessToken, login } = useSpotify()

const isLoggedIn = ref(false)

onBeforeMount(async () => {
  await login()

  isLoggedIn.value = true

  router.go(-1)
})

console.log('after login', accessToken.value)

const router = useRouter()
</script>

<template>
  <Spinner v-if="!isLoggedIn" :size="100" />
</template>
