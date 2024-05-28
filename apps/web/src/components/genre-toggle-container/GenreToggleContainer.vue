<script setup lang="ts">
import { GenreToggle } from '@/components/genre-toggle'
import type { GenreItem } from '@/components/types'

const props = defineProps<{ genreItems: GenreItem[] }>()
defineEmits<{
  (e: 'checked', genreItem: GenreItem): void
}>()
</script>

<template>
  <div class="genre-toggle-container">
    <div v-for="{ genre, isSelected } in props.genreItems" :key="genre">
      <GenreToggle
        @checked="(isSelected) => $emit('checked', { genre, isSelected })"
        :is-selected="isSelected"
        :genre="genre"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.genre-toggle-container {
  @apply flex flex-wrap gap-2;
}
</style>
