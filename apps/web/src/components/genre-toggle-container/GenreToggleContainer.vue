<script setup lang="ts">
import { GenreToggle } from '@/components/genre-toggle'
import type { GenreItem } from '@/components/types'

const props = defineProps<{ genreItems: GenreItem[] }>()
defineEmits<{
  (e: 'checked', genreItem: GenreItem): void
}>()
</script>

<template>
  <div v-for="{ genre, isSelected } in props.genreItems" :key="genre">
    <GenreToggle
      @checked="(isSelected) => $emit('checked', { genre, isSelected })"
      :is-selected="isSelected"
      :genre="genre"
    />
  </div>
</template>
