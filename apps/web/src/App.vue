<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
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
