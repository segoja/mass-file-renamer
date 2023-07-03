<template>
  <v-btn
    :title="btnTitle"
    :variant="btnVariant"
    :color="btnColor"
    :class="btnClass"
    size="small"
    rounded="0"
    v-draggable:disable
  >
    <v-icon :icon="btnIcon" size="x-large"></v-icon>
    <v-dialog v-model="dialog" activator="parent" :scrim="true" class="ma-14">
      <v-card class="rounded">
        <v-card-title>{{ t('text.abouttitle') }}</v-card-title>
        <v-card-text>
          <p>{{ t('text.abouttext.p1') }}</p>
          <p>{{ t('text.abouttext.p2') }}</p>
          <p>{{ t('text.abouttext.p3') }}</p>
          <p>{{ t('text.abouttext.p4') }}</p>
          <p>{{ t('text.abouttext.p5') }}</p>
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

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const dialog = ref(false)

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
