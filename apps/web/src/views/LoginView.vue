<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import useSpotify from '@/composables/useSpotify'
import { Spinner } from '@/components/ui/spinner'

const { isLoggedIn, login } = useSpotify()

onBeforeMount(async () => {
  await login()

  isLoggedIn.value = true

  router.go(-1)
})

const router = useRouter()
</script>

<template>
  <Spinner v-if="!isLoggedIn" :size="100" />
</template>
