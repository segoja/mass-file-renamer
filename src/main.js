import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { vuetify } from './plugins/vuetify.js'
import vueTauriDraggable from 'vue-tauri-draggable'
import 'vue-tauri-draggable/style.css'

import i18n from "./i18n"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(vueTauriDraggable)

app.mount('#app')
