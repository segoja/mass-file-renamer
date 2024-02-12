<template>
  <v-layout full-height full-width density="compact" class="h-100 w-100 flex-fill">
    <header class="bg-grey-darken-4">
      <TopMenuBar />
    </header>
    <v-theme-provider theme="high-contrast">
      <v-main
        :class="
          isDark ? 'd-flex flex-column h-100 flex-fill' : 'd-flex flex-column h-100 flex-fill light'
        "
      >
        <FileManager :isDark="isDark" />
      </v-main>
    </v-theme-provider>
  </v-layout>
</template>

<script setup>
import FileManager from './components/FileManager.vue'
import TopMenuBar from './components/TopMenuBar.vue'
import { configStore } from '@/stores/config'
import { storeToRefs } from 'pinia'

const store = configStore()
const { isDark } = storeToRefs(store)
const { savedLocale } = storeToRefs(store)
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
html::-webkit-scrollbar {
  display: none;
}
body,
html {
  overflow: hidden;
  height: 100%;
  background-color: transparent;
}
body {
  border: 2px solid rgba(64, 64, 64, 0.5) !important;
}

main {
  padding: 5rem 1rem 0rem 1rem;
}

main.light {
  background-color: rgba(0, 0, 0, 0.1);
}

main .files {
  background-color: rgba(0, 0, 0, 0.5);
}

main.light .files {
  background-color: rgba(255, 255, 255, 0.75);
}

#app {
  max-width: 100%;
}
.mini-tooltip > .v-overlay__content {
  font-size: 0.75em !important;
  padding: 0.25em 0.5em !important;
}
.v-tooltip .v-overlay__content {
  font-size: 0.75em !important;
  padding: 0.25em 0.5em !important;
  background-color: rgba(var(--v-border-color), 0.85) !important;
}
</style>
