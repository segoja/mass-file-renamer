<template>
  <v-btn
    :append-icon="btnAppendIcon"
    :title="btnTitle"
    :disabled="btnDisabled"
    :variant="btnVariant"
    :color="btnColor"
    :class="btnClass"
    :density="btnDensity"
  >
    {{ btnText || 'Confirm?' }}
    <v-dialog v-model="dialog" activator="parent" width="auto">
      <v-card>
        <v-card-title class="text-h6"> {{ t('text.confirmtitle') }} </v-card-title>
        <v-card-text>
          {{ t('text.confirmtext') }}
        </v-card-text>
        <v-card-actions>
          <v-row dense no-gutters>
            <v-col class="pr-1">
              <v-btn
                color="cyan-darken-1"
                :variant="isDark ? 'tonal' : 'elevated'"
                class="w-100"
                @click="dialog = false"
                :title="t('titles.no')"
              >
                {{ t('buttons.no') }}
              </v-btn>
            </v-col>
            <v-col class="pl-1">
              <v-btn
                color="warning"
                :variant="isDark ? 'tonal' : 'elevated'"
                class="w-100"
                @click="confirmAction(action)"
                :title="t('titles.yes')"
              >
                {{ t('buttons.yes') }}
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
  btnText: String,
  btnTitle: String,
  btnAppendIcon: String,
  btnDisabled: Boolean,
  btnDensity: String,
  btnVariant: String,
  btnColor: String,
  btnClass: String,
  action: Function,
  msg: String,
  isDark: Boolean
})

function confirmAction(action) {
  action()
  dialog.value = false
}
</script>
