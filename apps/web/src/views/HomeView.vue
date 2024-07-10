<script setup lang="ts">
import { computed } from 'vue'
import useSpotify from '@/composables/useSpotify'
import { GenreToggleContainer } from '@/components/genre-toggle-container'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const {
  accessToken,
  login,
  logout,
  getFavs,
  createPlaylist,
  DEFAULT_TIME_RANGE,
  timeRange,
  favouriteGenres,
  selectedGenres
} = useSpotify()

const toggleAllGenres = (isSelected: boolean) => {
  if (isSelected) {
    selectedGenres.value = favouriteGenres.value
  } else {
    selectedGenres.value = []
  }
}

const toggleGenre = (genre: string, isSelected: boolean) => {
  console.log('isSelected', isSelected)
  if (isSelected) {
    selectedGenres.value.push(genre)
  } else {
    selectedGenres.value = selectedGenres.value.filter((item) => item !== genre)
  }
}

const genreItems = computed(() => {
  return favouriteGenres.value.map((genre) => ({
    genre,
    isSelected: selectedGenres.value.includes(genre)
  }))
})
</script>

<template>
  <main>
    <Button v-if="!accessToken">
      <a @click="() => login()"> LOGIN </a>
    </Button>

    <template v-else>
      <Button>
        <a @click="logout"> LOGOUT </a>
      </Button>
      <div v-if="!favouriteGenres.length">
        <RadioGroup class="flex" :default-value="DEFAULT_TIME_RANGE" v-model="timeRange">
          <div>
            <RadioGroupItem id="r1" value="short_term" />
            <Label for="r1"> Short term</Label>
          </div>
          <div>
            <RadioGroupItem id="r2" value="medium_term" />
            <Label for="r2"> Mid term</Label>
          </div>
          <div>
            <RadioGroupItem id="r3" value="long_term" />
            <Label for="r3"> Long term</Label>
          </div>
        </RadioGroup>

        <Button>
          <a @click="getFavs"> GET GENRES </a>
        </Button>
      </div>
      <Button v-else :disabled="!selectedGenres.length">
        <a @click="createPlaylist"> CREATE PLAYLIST </a>
      </Button>
    </template>

    <div v-if="favouriteGenres && favouriteGenres.length">
      <h2>Favourite Genres</h2>

      <div>
        <Checkbox @update:checked="(isSelected) => toggleAllGenres(isSelected)" />
        <label> | Select All</label>
      </div>

      <GenreToggleContainer
        @checked="({ genre, isSelected }) => toggleGenre(genre, isSelected)"
        :genre-items="genreItems"
      />
    </div>
  </main>
</template>
