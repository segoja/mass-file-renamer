<template>
    <v-layout full-height>
      <v-app-bar prominent
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

        <v-btn variant="text" icon="mdi-magnify" v-draggable:disable ></v-btn>

        <v-btn variant="text" icon="mdi-filter" v-draggable:disable ></v-btn>

        <v-btn variant="text" icon="mdi-dots-vertical" v-draggable:disable ></v-btn>
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
      <v-main>
        <v-container :fluid=true>
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
</template>
<script>  
  export default {
    data: () => ({
      drawer: false,
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
  body {
      display: flex;
      place-items: initial;
      border: 5px solid rgba(0,0,0,0.5)!important;
  }
  #app{
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
    min-height: 100%;
    padding: 0 2rem!important;
  }
</style>
