<script setup lang="ts">
import useSpotify from '@/composables/useSpotify'

const { login, logout, getFavs } = useSpotify()
</script>

<template>
  <main>
    <a @click="login"> LOGIN </a>
    <a @click="logout"> LOGOUT </a>
    <a @click="getFavs"> CHECK </a>
  </main>
</template>
