<script setup lang="ts">
import useSpotify from '@/composables/useSpotify'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const { login, logout, getFavs, createPlaylist, favouriteGenres, selectedGenres } = useSpotify()

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
    <Button>
      <a @click="login"> LOGIN </a>
    </Button>
    <Button>
      <a @click="logout"> LOGOUT </a>
    </Button>
    <Button>
      <a @click="getFavs"> GET GENRES </a>
    </Button>
    <Button>
      <a @click="createPlaylist"> CREATE PLAYLIST </a>
    </Button>
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
