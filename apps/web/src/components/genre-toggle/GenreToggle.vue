<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

defineProps<{ isSelected: boolean; genre: string }>()
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
