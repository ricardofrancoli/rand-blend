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

<style scoped lang="postcss">
.router-container,
.wrapper {
  @apply mx-8;
}
</style>
