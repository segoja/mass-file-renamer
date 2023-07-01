<template>
  <v-layout full-height full-width density="compact" class="h-100 w-100 flex-fill">
    <header>
      <v-system-bar window v-draggable color="grey-darken-4" class="mr-0 pr-0" :elevation="3">
        <span class="text-grey-lighten-5">Mass File Renamer {{appVersion}}</span>
        
        <v-spacer></v-spacer>
        <AboutModal
          btnTitle="Help/About"
          btnIcon="mdi-help-box-outline"
          btnVariant="flat"
          btnColor="default"
          version="appVersion"
        />

        <v-btn variant="flat" size="small" rounded="0" v-draggable:disable @click="minimizeWindow">
          <v-icon icon="mdi-window-minimize" size="x-large"></v-icon>        
        </v-btn>
        <v-btn variant="flat" size="small" rounded="0" v-draggable:disable @click="maximizeWindow">
          <v-icon icon="mdi-window-maximize" size="x-large"></v-icon>         
        </v-btn>
        <v-btn variant="flat" size="small" rounded="0" v-draggable:disable @click="closeWindow">
          <v-icon icon="mdi-window-close" size="x-large" color="red"></v-icon>         
        </v-btn>
      </v-system-bar>
    </header>

    <v-navigation-drawer v-model="drawer" temporary location="top">
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :title="item.title" :to="item.value" />
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item variant="plain" class="text-left">
            Mass File Renamer {{appVersion}}
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main class="d-flex flex-column h-100 flex-fill">
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup>
import AboutModal from './components/AboutModal.vue'
import { useTheme } from 'vuetify'
import { appWindow, getCurrent } from '@tauri-apps/api/window'
import { ref, computed, reactive, onMounted, onUpdated, watch, isProxy, toRaw } from 'vue'


const theme = useTheme()
const appVersion = 'v'+process.env.APP_VERSION || '0'

function toggleLight(){
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
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
function dragWindow(event) {
  event.preventDefault()
  appWindow.startDragging()
}
function dropWindow(event) {
  event.preventDefault()
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
}
body {
  border: 5px solid rgba(0, 0, 0, 0.5) !important;
}

header .v-system-bar {
  border-top: 4px solid rgba(0, 0, 0, 0.5) !important;
  border-left: 4px solid rgba(0, 0, 0, 0.5) !important;
  border-right: 4px solid rgba(0, 0, 0, 0.5) !important;
}

main {
  padding: 5rem 1rem 0rem 1rem; 
}
#app {
  max-width: 100%;
}
</style>
