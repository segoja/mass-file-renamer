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
      <v-dialog
        v-model="dialog"
        activator="parent"
        :scrim="false"
        class="ma-14"
      >
        <v-card class="rounded">
          <v-toolbar
            color="teal-darken-4"
            variant="tonal"
            title="Mass File Renamer, by Javier Sevilla"
          ></v-toolbar>
          <v-card-title>
            About/Help
          </v-card-title>
          <v-card-text>
            <p>Because of what I do for a living I spend a lot of time renaming files. Tired of not having a tool to fit my needs I decided to make this app using the latest Vue and Tauri versions.</p>
            <p>The idea was to make editing files as simple as possible, treating filenames like you would do on any regular text editor like notepad.</p>
            <p>I created a template system so you can rename massive amounts of files using the same naming template/convention for all of them, so you can number them, include the date or time, add prefix or suffix, etc.</p>
            <p>You can also find, replace and remove fragments of the file names, allowing even the use of regular expressions (regex)</p>
            <p>Additionally you can also upper case or lowercase file names.</p>
          </v-card-text>
          <v-card-actions>
            <v-row dense no-gutters>
              <v-col class="pl-1 text-right">
                <v-btn
                  color="secondary"
                  variant="tonal"
                  class="px-5"
                  @click="confirmAction(action)"
                >
                  Close
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
  "version": String,
  "btnTitle": String,
  "btnIcon": String,
  "btnVariant": String,
  "btnColor": String,
  "btnClass": String,
})

function showDialog(){
  dialog.value = true;
}

function confirmAction(){
  dialog.value = false;
}

</script>
