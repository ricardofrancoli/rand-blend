<script setup lang="ts">
import { RouterView } from 'vue-router'

import { NavBar } from '@/components/nav-bar'
</script>

<template>
  <header>
    <div class="wrapper">
      <NavBar />
    </div>
  </header>

  <div class="router-container">
    <RouterView />
  </div>
</template>

<style lang="postcss">
h1 {
  @apply text-5xl font-bold text-left my-4;
}

h2 {
  @apply text-4xl font-bold text-left my-4;
}
</style>

<style scoped lang="postcss">
.router-container,
.wrapper {
  @apply mx-8;
}
</style>
