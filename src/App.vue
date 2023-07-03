<template>
  <v-layout full-height full-width density="compact" class="h-100 w-100 flex-fill">
    <header class="bg-grey-darken-4">
      <v-system-bar
        window
        v-draggable
        :color="isDark ? 'grey-darken-4' : 'grey-darken-3'"
        class="mr-0 pr-0"
        elevation="3"
      >
        <span class="text-grey-lighten-2 pl-2 font-weight-bold text-uppercase"
          >Mass File Renamer {{ appVersion }}</span
        >

        <v-spacer></v-spacer>
        <LangSwitcher />

        <v-btn
          variant="flat"
          size="small"
          rounded="0"
          v-draggable:disable
          @click="toggleLight"
          class="bg-transparent"
          :title="t('titles.mode')"
        >
          <v-icon icon="mdi-theme-light-dark" size="x-large"></v-icon>
        </v-btn>
        <AboutModal
          :btnTitle="t('titles.about')"
          btnIcon="mdi-help-box-outline"
          btnVariant="flat"
          btnColor="default"
          :isDark="isDark"
          version="appVersion"
          btnClass="bg-transparent"
        />

        <v-btn
          variant="flat"
          size="small"
          rounded="0"
          v-draggable:disable
          @click="minimizeWindow"
          class="bg-transparent"
        >
          <v-icon icon="mdi-window-minimize" size="x-large"></v-icon>
        </v-btn>
        <v-btn
          variant="flat"
          size="small"
          rounded="0"
          v-draggable:disable
          @click="maximizeWindow"
          class="bg-transparent"
        >
          <v-icon icon="mdi-window-maximize" size="x-large"></v-icon>
        </v-btn>
        <v-btn
          variant="flat"
          size="small"
          rounded="0"
          v-draggable:disable
          @click="closeWindow"
          class="bg-transparent"
        >
          <v-icon icon="mdi-window-close" size="x-large" color="red"></v-icon>
        </v-btn>
      </v-system-bar>
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
import { useI18n } from 'vue-i18n'
import AboutModal from './components/AboutModal.vue'
import FileManager from './components/FileManager.vue'
import LangSwitcher from './components/LangSwitcher.vue'
import { useTheme } from 'vuetify'
import { getCurrent } from '@tauri-apps/api/window'
import { configStore } from '@/stores/config'
import { storeToRefs } from 'pinia'

const store = configStore()
const { isDark } = storeToRefs(store)
const { savedLocale } = storeToRefs(store)

const theme = useTheme()

const { t, locale } = useI18n()

locale.value = savedLocale.value

theme.name.value = isDark.value ? 'dark' : 'light'

const appVersion = 'v' + process.env.APP_VERSION || '0'

function toggleLight() {
  store.toggleMode()
  theme.name.value = isDark.value ? 'dark' : 'light'
}

async function minimizeWindow() {
  let currentWindow = getCurrent()
  currentWindow.minimize()
}

async function maximizeWindow() {
  let currentWindow = getCurrent()
  let isMaxed = await currentWindow.isMaximized()
  if (isMaxed) {
    currentWindow.unmaximize()
  } else {
    currentWindow.maximize()
  }
}

async function closeWindow() {
  let currentWindow = getCurrent()
  currentWindow.close()
}
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
  border: 5px solid rgba(0, 0, 0, 0.5) !important;
}

header .v-system-bar {
  /*border-top: 4px solid rgba(0, 0, 0, 0.5) !important;
  border-left: 4px solid rgba(0, 0, 0, 0.5) !important;
  border-right: 4px solid rgba(0, 0, 0, 0.5) !important;
  border-bottom: 4px solid rgba(0, 0, 0, 0.5) !important;*/
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
</style>
