<template>
    <v-system-bar
    window
    v-draggable
    :color="isDark ? 'grey-darken-4' : 'grey-darken-3'"
    class="mr-0 pr-0"
    elevation="3"
    >
        <img src="../assets/logo.svg" class="logo" />
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
        >
        <v-icon icon="mdi-theme-light-dark" size="large"></v-icon>
            <v-tooltip activator="parent" location="bottom">{{ t('titles.mode') }}</v-tooltip>
        </v-btn>
        <AboutModal
        :btnTitle="t('titles.about')"
        btnIcon="mdi-help-box-outline"
        btnVariant="flat"
        btnColor="default"
        :isDark="isDark"
        :version="appVersion"
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
        color="red-accent-4"
        variant="flat"
        size="small"
        rounded="0"
        v-draggable:disable
        @click="closeWindow"
        class="close-app"
        >
            <v-icon icon="mdi-window-close" size="x-large"></v-icon>
        </v-btn>
    </v-system-bar>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AboutModal from './AboutModal.vue'
import LangSwitcher from './LangSwitcher.vue'
import { useTheme } from 'vuetify'
import { getCurrent } from '@tauri-apps/api/window'
import { configStore } from '@/stores/config'
import { storeToRefs } from 'pinia'


const store = configStore()
const { isDark } = storeToRefs(store)
const { savedLocale } = storeToRefs(store)

const { t, locale } = useI18n()
locale.value = savedLocale.value

const theme = useTheme()

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

.v-system-bar {
  padding: 16px 10px;
  border-top: 2px solid rgba(64, 64, 64, 0.5) !important;
  border-left: 2px solid rgba(64, 64, 64, 0.5) !important;
  border-right: 2px solid rgba(64, 64, 64, 0.5) !important;
}

header {
  display: block;
  position: absolute;
  z-index: 99999;
}

header button.close-app {
  background-color: transparent !important;
}
header button.close-app:hover {
  background-color: #d50000 !important;
  color: white !important;
}
header img.logo {
  height: 1.5em !important;
  margin-right: -3px;
}
</style>
