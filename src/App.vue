<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const app = ref(null)
</script>

<template>
  <v-app ref="app">
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style> 