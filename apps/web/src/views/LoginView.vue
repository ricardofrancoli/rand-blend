<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import useSpotify from '@/composables/useSpotify'
import { Spinner } from '@/components/ui/spinner'

const { accessToken, login } = useSpotify()

const isLoggedIn = ref(!!accessToken.value)

onBeforeMount(async () => {
  await login()

  isLoggedIn.value = true
})

console.log('after login', accessToken.value)

const router = useRouter()
router.go(-1)
</script>

<template>
  <Spinner v-if="!isLoggedIn" :size="200" />
</template>
