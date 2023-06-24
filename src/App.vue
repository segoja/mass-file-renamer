<template>
  <v-layout full-height full-width
      density="compact" class="h-100 w-100 flex-fill">
    <v-app-bar prominent 
      density="compact"
      v-draggable
    >
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
        v-draggable:disable
      >
      </v-app-bar-nav-icon>

      <v-toolbar-title>MFR</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn variant="text" icon="mdi-theme-light-dark" v-draggable:disable @click="toggleLight"></v-btn>
      <v-btn variant="text" icon="mdi-window-minimize" v-draggable:disable @click="minimizeWindow"></v-btn>
      <v-btn variant="text" icon="mdi-window-maximize" v-draggable:disable @click="maximizeWindow"></v-btn>
      <v-btn variant="text" icon="mdi-close" v-draggable:disable @click="closeWindow"></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="top" temporary>
      <v-list>
        <v-list-item 
          v-for="item in items"
          :key="item.title"
          :title="item.title"
          :to="item.value"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex flex-column h-100 flex-fill">
      <RouterView />
    </v-main>
  </v-layout>
</template>
<script>
  import { useTheme } from 'vuetify'
  import { appWindow, getCurrent } from '@tauri-apps/api/window';

  export default {
    setup () {
      const theme = useTheme()

      return {
        theme,
        toggleLight: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
      }
    },
    data: () => ({
      drawer: false,
      light: true,
      group: null,
      items: [
        {
          title: 'Renamer',
          value: '/',
        },
        {
          title: 'About',
          value: '/about',
        },
      ],
    }),

    watch: {
      group() {
        this.drawer = false
      },
    },
    methods: {
      increaseCount(n) {
        this.count += n
      }, 
      async minimizeWindow() {
        let currentWindow = getCurrent();
        currentWindow.minimize();
      },   
      async maximizeWindow() {
        let currentWindow = getCurrent();
        let isMaxed = await currentWindow.isMaximized();
        if(isMaxed){
          currentWindow.unmaximize();
        } else {
          currentWindow.maximize();        
        }
      },  
      async closeWindow() {
        let currentWindow = getCurrent();
        currentWindow.close();
      },      
      dragWindow(event) {
        event.preventDefault();
        appWindow.startDragging();
      },
      dropWindow(event) {
        event.preventDefault();
      }
    }
  }
</script>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  html::-webkit-scrollbar {
    display: none;
  }
  body, html { overflow: hidden; height: 100%; }
  body {
      border: 5px solid rgba(0,0,0,0.5)!important;
  }
  
  header { 
    border-top: 3px solid rgba(0,0,0,0.5)!important;
    border-left: 3px solid rgba(0,0,0,0.5)!important;
    border-right: 3px solid rgba(0,0,0,0.5)!important;  
  }
  
  main { padding: 5rem 1rem 0rem 1rem; }
  #app { max-width: 100%; } 
</style>
