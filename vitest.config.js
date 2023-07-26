import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      vue(),
      VueI18nPlugin({
        // compositionOnly: false,
        runtimeOnly: false,
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**')
      })
    ],
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      transformMode: {
        web: [/\.[jt]sx$/],
      },
    }
  })
)
