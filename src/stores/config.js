import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const configStore = defineStore('config', () => {
    const isDark = ref(false)
    
    if(localStorage.getItem('isDark')){
      isDark.value = JSON.parse(localStorage.getItem('isDark'));
    }
    
    watch(isDark, (isDarkVal) => {
      localStorage.setItem('isDark', JSON.stringify(isDarkVal))
    }, { deep: true })
    
    function toggleMode() {
      isDark.value = !isDark.value;
    }
    return { isDark, toggleMode }
})