<template>
  <v-btn
    variant="flat"
    size="small"
    rounded="0"
    v-draggable:disable
    @click="switchLang"
    class="bg-transparent text-bold"
  >
    {{ locale }}
    <v-tooltip activator="parent" location="bottom">{{ t('titles.language') }}</v-tooltip>
  </v-btn>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { configStore } from '@/stores/config'
import { storeToRefs } from 'pinia'

const store = configStore()
const { savedLocale } = storeToRefs(store)

const { t, locale } = useI18n()

locale.value = savedLocale.value

function switchLang() {
  if (savedLocale.value != 'en') {
    store.switchLang('en')
  } else {
    store.switchLang('es')
  }
  locale.value = savedLocale.value
}
</script>
