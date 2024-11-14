<script setup lang="ts">
import { computed, ref } from 'vue'
import useSpotify from '@/composables/useSpotify'
import { GenreToggleContainer } from '@/components/genre-toggle-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const {
  login,
  getFavs,
  createPlaylist,
  DEFAULT_TIME_RANGE,
  timeRange,
  favouriteGenres,
  selectedGenres,
  isLoading,
  isLoggedIn
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

const isEnoughSelectedGenres = computed(() => selectedGenres.value.length >= 5)
const hasPlaylistName = computed(() => !!playlistName.value)
const canCreatePlaylist = computed(() => {
  return !isLoading.value && hasPlaylistName.value && isEnoughSelectedGenres.value
})
const invalidCreatePlaylistMsg = computed<string>(() => {
  if (!isEnoughSelectedGenres.value) {
    return 'Select at least 5 genres'
  }

  if (!hasPlaylistName.value) {
    return 'You need to add a playlist name'
  }

  return ''
})
</script>

<template>
  <main>
    <h2>Genre Blender</h2>

    <Button v-if="!isLoggedIn">
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

        <Button :disabled="isLoading">
          <a @click="getFavs"> GET GENRES </a>
        </Button>
      </div>
      <template v-else>
        <Input placeholder="Playlist name" v-model="playlistName" />
        <TooltipProvider>
          <Tooltip :delay-duration="100">
            <TooltipTrigger>
              <Button :variant="canCreatePlaylist ? 'default' : 'disabled'">
                <a @click="createPlaylist(playlistName)"> CREATE PLAYLIST </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent v-if="!canCreatePlaylist" :class="'bg-amber-900'">
              {{ invalidCreatePlaylistMsg }}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </template>
    </template>

    <Spinner v-if="isLoading" :size="80" />
    <div v-else-if="favouriteGenres && favouriteGenres.length">
      <h2>Favourite Genres</h2>

      <GenreToggleContainer
        @checked="({ genre, isSelected }) => toggleGenre(genre, isSelected)"
        :genre-items="genreItems"
      />
    </div>
  </main>
</template>
