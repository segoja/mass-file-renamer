<template>
  <v-btn
    :variant="btnVariant"
    :color="btnColor"
    :class="btnClass"
    size="small"
    rounded="0"
    v-draggable:disable
  >
    <v-icon :icon="btnIcon" size="large"></v-icon>
    <v-tooltip activator="parent" location="bottom">{{ btnTitle }}</v-tooltip>
    <v-dialog v-model="dialog" activator="parent" :scrim="true" width="800" height="600">
      <v-card class="rounded">
        <v-tabs
          v-model="tab"
          align-tabs="start"
        >
          <v-tab :value="1">{{ t('text.abouttitle') }}</v-tab>
          <v-tab :value="2">{{ t('text.helptitle') }}</v-tab>
        </v-tabs>
        <v-card-text v-if="tab === 1">
          <h3 class="text-secondary"><strong>{{t('text.abouttext.p1') }} {{version}}</strong></h3>
          <p><strong>{{ t('text.abouttext.p2') }}</strong><br><br></p>
          <p><strong>{{ t('text.abouttext.p3') }}</strong></p>
          <p>{{ t('text.abouttext.p4') }}<br><br></p>
          <p><strong>{{ t('text.abouttext.p5') }}</strong></p>
          <p><a href="https://github.com/segoja/mass-file-renamer" target="_blank" rel="noopener noreferrer">https://github.com/segoja/mass-file-renamer</a> </p>
          <p>{{ t('text.abouttext.p6') }}<br><br></p>
        </v-card-text>
        <v-card-text v-if="tab === 2">
          <p>{{ t('text.helptext.p1') }}</p>
          <p>{{ t('text.helptext.p2') }}</p>
          <p>{{ t('text.helptext.p3') }}</p>
          <p>{{ t('text.helptext.p4') }}</p>
          <p>{{ t('text.helptext.p5') }}</p>
          <p>{{ t('text.helptext.p6') }}</p>
          <p>{{ t('text.helptext.p7') }}</p>
          <p>{{ t('text.helptext.p8') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-row dense no-gutters>
            <v-col class="pl-1 text-right">
              <v-btn
                color="cyan-darken-1"
                :variant="isDark ? 'tonal' : 'elevated'"
                class="px-5"
                @click="confirmAction(action)"
                :title="t('titles.close')"
              >
                {{ t('buttons.close') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>
<style>
</style>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const dialog = ref(false)

const tab = ref(null)

const { t } = useI18n()

const props = defineProps({
  version: String,
  btnTitle: String,
  btnIcon: String,
  btnVariant: String,
  btnColor: String,
  btnClass: String,
  isDark: Boolean
})

function confirmAction() {
  dialog.value = false
}
</script>
