<script setup lang="ts">
import { computed, ref } from 'vue'
import useSpotify from '@/composables/useSpotify'
import { GenreToggleContainer } from '@/components/genre-toggle-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

const {
  accessToken,
  login,
  getFavs,
  createPlaylist,
  DEFAULT_TIME_RANGE,
  timeRange,
  favouriteGenres,
  selectedGenres,
  isLoadingFavs
} = useSpotify()

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

const playlistName = ref('')
</script>

<template>
  <main>
    <h2>Genre Blender</h2>

    <Button v-if="!accessToken">
      <a @click="login"> LOG IN TO SPOTIFY </a>
    </Button>

    <template v-else>
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

        <Button :disabled="isLoadingFavs">
          <a @click="getFavs"> GET GENRES </a>
        </Button>
      </div>
      <template v-else>
        <Input placeholder="Playlist name" v-model="playlistName" />
        <Button
          :variant="
            !selectedGenres.length || isLoadingFavs || !playlistName ? 'disabled' : 'default'
          "
        >
          <a @click="createPlaylist(playlistName)"> CREATE PLAYLIST </a>
        </Button>
      </template>
    </template>

    <Spinner v-if="isLoadingFavs" :size="80" />

    <div v-if="favouriteGenres && favouriteGenres.length">
      <h2>Favourite Genres</h2>

      <GenreToggleContainer
        @checked="({ genre, isSelected }) => toggleGenre(genre, isSelected)"
        :genre-items="genreItems"
      />
    </div>
  </main>
</template>
