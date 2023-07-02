<template>
  <v-layout full-height full-width density="compact" class="h-100 w-100 flex-fill">
      <header class="bg-grey-darken-4">
        <v-system-bar window v-draggable color="grey-darken-4" class="mr-0 pr-0" :elevation="3">
          <span class="text-grey-lighten-5">Mass File Renamer {{appVersion}}</span>
          
          <v-spacer></v-spacer>
          <v-btn variant="flat" size="small" rounded="0" v-draggable:disable @click="toggleLight" class="bg-grey-darken-4">
            <v-icon icon="mdi-theme-light-dark" size="x-large"></v-icon>        
          </v-btn>
          <AboutModal
            btnTitle="Help/About"
            btnIcon="mdi-help-box-outline"
            btnVariant="flat"
            btnColor="default"
            version="appVersion"
            btnClass="bg-grey-darken-4"
          />

          <v-btn variant="flat" size="small" rounded="0" v-draggable:disable @click="minimizeWindow" class="bg-grey-darken-4">
            <v-icon icon="mdi-window-minimize" size="x-large"></v-icon>        
          </v-btn>
          <v-btn variant="flat" size="small" rounded="0" v-draggable:disable @click="maximizeWindow" class="bg-grey-darken-4">
            <v-icon icon="mdi-window-maximize" size="x-large"></v-icon>         
          </v-btn>
          <v-btn variant="flat" size="small" rounded="0" v-draggable:disable @click="closeWindow" class="bg-grey-darken-4">
            <v-icon icon="mdi-window-close" size="x-large" color="red"></v-icon>         
          </v-btn>
        </v-system-bar>
      </header>
    <v-theme-provider theme="high-contrast">
      <v-main class="d-flex flex-column h-100 flex-fill">
        <FileManager isDark="mode.isDark"/>
      </v-main>
    </v-theme-provider >
  </v-layout>
</template>

<script setup>
import AboutModal from './components/AboutModal.vue'
import FileManager from './components/FileManager.vue'
import { useTheme } from 'vuetify'
import { appWindow, getCurrent } from '@tauri-apps/api/window'
import { ref, computed, reactive, onMounted, onUpdated, watch, isProxy, toRaw } from 'vue'


const theme = useTheme()
const appVersion = 'v'+process.env.APP_VERSION || '0'

const mode = reactive({ 
  isDark: false
})

function toggleLight(){
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  mode.isDark = theme.global.current.value.dark ? true : false;
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
  background-color: transparent;
}
#app {
  max-width: 100%;
  background-color: transparent;
}
</style>
