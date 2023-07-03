<template>
  <v-btn
    :append-icon="btnAppendIcon"
    :title="btnTitle"
    :disabled="btnDisabled"
    :variant="btnVariant"
    :color="btnColor"
    :class="btnClass"
  >
    {{ btnText || 'Confirm?' }}
    <v-dialog v-model="dialog" activator="parent" width="auto">
      <v-card>
        <v-card-title class="text-h6"> Confirm action </v-card-title>
        <v-card-text>
          {{ msg }}
        </v-card-text>
        <v-card-actions>
          <v-row dense no-gutters>
            <v-col class="pr-1">
              <v-btn color="success" variant="tonal" class="w-100" @click="dialog = false">
                No
              </v-btn>
            </v-col>
            <v-col class="pl-1">
              <v-btn color="error" variant="tonal" class="w-100" @click="confirmAction(action)">
                Yes
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

const dialog = ref(false)

const props = defineProps({
  btnText: String,
  btnTitle: String,
  btnAppendIcon: String,
  btnDisabled: Boolean,
  btnVariant: String,
  btnColor: String,
  btnClass: String,
  action: Function,
  msg: String
})

function showDialog() {
  dialog.value = true
}

function confirmAction(action) {
  action()
  dialog.value = false
}
</script>
