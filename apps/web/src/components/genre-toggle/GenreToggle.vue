<script setup lang="ts">
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
    <Button>
      <Checkbox :checked="isSelected" />
      <label>{{ genre }}</label>
    </Button>
  </div>
</template>
