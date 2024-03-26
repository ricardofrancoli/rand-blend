<script setup lang="ts">
import { ref } from 'vue'

import useSpotify from '@/composables/useSpotify'
import { Checkbox } from '@/components/ui/checkbox'

const { login, logout, getFavs, favouriteGenres } = useSpotify()

const selectedGenres = ref<string[]>([])

const toggleAllGenres = (isSelected: boolean) => {
  if (isSelected) {
    selectedGenres.value = favouriteGenres.value
  } else {
    selectedGenres.value = []
  }
}

const toggleGenre = (genre: string, isSelected: boolean) => {
  if (isSelected) {
    selectedGenres.value.push(genre)
  } else {
    selectedGenres.value = selectedGenres.value.filter((item) => item !== genre)
  }
}
</script>

<template>
  <main>
    <a @click="login"> LOGIN </a>
    <a @click="logout"> LOGOUT </a>
    <a @click="getFavs"> CHECK </a>
    {{ selectedGenres }}
    <div v-if="favouriteGenres && favouriteGenres.length">
      <h2>Favourite Genres</h2>

      <div>
        <Checkbox @update:checked="(isSelected) => toggleAllGenres(isSelected)" />
        <label> | Select All</label>
      </div>

      <div v-for="genre in favouriteGenres" :key="genre">
        <Checkbox
          :checked="selectedGenres.includes(genre)"
          @update:checked="(isSelected) => toggleGenre(genre, isSelected)"
        />
        <label> | {{ genre }}</label>
      </div>
    </div>
  </main>
</template>
