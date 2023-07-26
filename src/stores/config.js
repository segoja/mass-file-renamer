import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const configStore = defineStore('config', () => {
  const isDark = ref(true)
  const savedLocale = ref('en')

  if (localStorage.getItem('isDark')) {
    isDark.value = JSON.parse(localStorage.getItem('isDark'))
  }
  if (localStorage.getItem('savedLocale')) {
    savedLocale.value = JSON.parse(localStorage.getItem('savedLocale'))
  }
  watch(
    isDark,
    (isDarkVal) => {
      localStorage.setItem('isDark', JSON.stringify(isDarkVal))
    },
    { deep: true }
  )
  watch(
    savedLocale,
    (savedLocaleVal) => {
      localStorage.setItem('savedLocale', JSON.stringify(savedLocaleVal))
    },
    { deep: true }
  )
  function toggleMode() {
    isDark.value = !isDark.value
  }
  function switchLang(lang) {
    savedLocale.value = lang
  }
  return { isDark, savedLocale, toggleMode, switchLang }
})
