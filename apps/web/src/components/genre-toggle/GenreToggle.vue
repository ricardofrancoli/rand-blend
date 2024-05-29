<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { GenreItem } from '@/components/types'

defineProps<GenreItem>()
defineEmits<{
  (e: 'checked', checked: boolean): void
}>()
</script>

<template>
  <div @click="$emit('checked', !isSelected)">
    <Button class="flex gap-2">
      <Plus v-if="!isSelected" class="h-4 w-4" />
      <Checkbox v-else :checked="isSelected" />
      <label>{{ genre }}</label>
    </Button>
  </div>
</template>
