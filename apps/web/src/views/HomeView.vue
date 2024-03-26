<script setup lang="ts">
import useSpotify from '@/composables/useSpotify'

const { login, logout, getFavs, favouriteGenres } = useSpotify()
</script>

<template>
  <main>
    <a @click="login"> LOGIN </a>
    <a @click="logout"> LOGOUT </a>
    <a @click="getFavs"> CHECK </a>
    <div v-if="favouriteGenres && favouriteGenres.length">
      <h2>Favourite Genres</h2>
      <ul>
        <li v-for="genre in favouriteGenres" :key="genre">{{ genre }}</li>
      </ul>
    </div>
  </main>
</template>
