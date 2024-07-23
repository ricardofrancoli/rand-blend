<script setup lang="ts">
import { RouterLink } from 'vue-router'
import useSpotify from '@/composables/useSpotify'
import { Button } from '@/components/ui/button'

const { isLoggedIn, logout } = useSpotify()
</script>

<template>
  <nav class="nav-bar">
    <div class="links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </div>
    <Button v-if="isLoggedIn">
      <a @click="logout"> LOGOUT </a>
    </Button>
  </nav>
</template>

<style scoped lang="postcss">
.nav-bar {
  @apply flex justify-between items-center py-4;
}

.links {
  @apply flex gap-4;
}
</style>
