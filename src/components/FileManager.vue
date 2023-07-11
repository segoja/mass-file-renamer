<template>
  <v-row dense class="mx-2 pt-3">
    <v-col cols="12" sm="6">
      <v-row dense no-gutters class="mh-100">
        <v-col class="mh-100 pr-2">
          <v-btn
            append-icon="mdi-folder"
            @click="openFolder"
            :variant="isDark ? 'tonal' : 'elevated'"
            color="cyan-darken-1"
            class="w-100 mh-100"
            :title="t('titles.folder')"
          >
            {{ t('buttons.folder') }}
          </v-btn>
        </v-col>
        <v-col class="mh-100 pr-2">
          <v-btn
            append-icon="mdi-file"
            @click="selectFiles"
            :variant="isDark ? 'tonal' : 'elevated'"
            color="cyan-darken-1"
            class="w-100 mh-100"
            :title="t('titles.files')"
          >
            {{ t('buttons.files') }}
          </v-btn>
        </v-col>
        <v-col class="mh-100 col-auto pr-2">
          <v-btn
            @click="restoreNames"
            color="cyan-darken-1"
            :variant="isDark ? 'tonal' : 'elevated'"
            :disabled="isDisabled"
            class="w-100 mh-100"
            :title="t('titles.restore')"
          >
            <v-icon size="large" icon="mdi-restore" />
          </v-btn>
        </v-col>
        <v-col class="mh-100">
          <ButtonConfirm
            :btnText="t('buttons.rename')"
            :btnTitle="t('titles.rename')"
            btnAppendIcon="mdi-content-save"
            :btnDisabled="isDisabled"
            :btnVariant="isDark ? 'tonal' : 'elevated'"
            btnColor="warning"
            btnClass="w-100 mh-100"
            :action="saveFiles"
            :isDark="isDark"
            :msg="t('text.confirmtext')"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="6">
      <v-row no-gutters dense>
        <v-col>
          <v-text-field
            v-model="state.fileFilter"
            :label="t('labels.filter')"
            density="compact"
            variant="solo"
            append-inner-icon="mdi-filter"
            single-line
            hide-details
            clearable
            :disabled="disableFilter"
            @keydown="filterDown"
          />
        </v-col>
        <v-col class="col-auto mh-100">
          <v-btn
            @click="toggleToLower"
            color="cyan-darken-1"
            :variant="isDark ? 'tonal' : 'elevated'"
            :disabled="isDisabled"
            class="ml-2 mh-100"
            :title="t('titles.tolower')"
          >
            <span class="text-h6">A</span>
            <v-icon size="large" icon="mdi-arrow-right" />
            <span class="text-lowercase text-h6">a</span>
          </v-btn>
        </v-col>
        <v-col class="col-auto mh-100">
          <v-btn
            @click="toggleToUpper"
            color="cyan-darken-1"
            :variant="isDark ? 'tonal' : 'elevated'"
            :disabled="isDisabled"
            class="ml-2 mh-100"
            :title="t('titles.toupper')"
          >
            <span class="text-lowercase text-h6">a</span>
            <v-icon size="large" icon="mdi-arrow-right" />
            <span class="text-h6">A</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row class="mx-2" dense>
    <v-col cols="12" md="6">
      <v-row dense justify="space-around" no-gutters>
        <v-col class="mh-100 align-end">
          <v-chip-group
            :class="
              isDisabled
                ? 'v-field v-field--variant-solo d-block rounded py-0 my-0 px-1 v-field--disabled'
                : 'v-field v-field--variant-solo d-block rounded py-0 my-0 px-1'
            "
            :disabled="isDisabled"
            justify="space-around"
            selected-class="none"
          >
            <v-chip variant="text" label draggable class="v-label my-1 pr-0">
              {{ t('labels.elements') }}
            </v-chip>
            <v-chip
              class="my-0 mx-0 mr-1 py-0 px-2"
              v-for="item in items"
              draggable
              label
              :key="item"
              @click="addElement(item)"
              size="small"
            >
              {{ t('titles.' + item) }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col class="col-auto mh-100">
          <v-btn
            label
            draggable
            class="my-0 py-0 px-3 ml-2 mh-100"
            @click="clearElements"
            :variant="isDark ? 'tonal' : 'elevated'"
            color="cyan-darken-1"
            :disabled="isDisabled ? true : !state.elements.length"
            :title="t('titles.clear')"
            append-icon="mdi-delete-outline"
          >
            {{ state.elements.length }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-chip-group
            :class="
              isDisabled
                ? 'v-field v-field--variant-solo d-block rounded  py-0 px-1 d-block w-100 h-100 v-field--disabled'
                : 'v-field v-field--variant-solo d-block rounded py-0 px-1 d-block w-100 h-100'
            "
            :disabled="isDisabled"
          >
            <v-row no-gutters dense align="center" justify="start">
              <v-col class="col-auto">
                <v-chip variant="text" label draggable class="v-label my-1 pr-0">
                  {{ t('labels.template') }}
                </v-chip>
              </v-col>
              <v-col class="fancyscroll py-0 my-0" align="center">
                <v-slide-group show-arrows class="w-100 py-0" compact>
                  <v-slide-group-item v-for="(item, index) in state.elements" :key="item">
                    <v-chip
                      label
                      draggable
                      class="my-0 mx-0 mr-1 px-2 py-0 text-warning"
                      size="small"
                      @click="removeElement(index)"
                    >
                      {{ t('titles.' + item) }}
                    </v-chip>
                  </v-slide-group-item>
                </v-slide-group>
              </v-col>
            </v-row>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="6">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="state.prefix"
            :label="t('labels.prefix')"
            density="compact"
            variant="solo"
            single-line
            hide-details
            clearable
            :disabled="isDisabled"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="state.suffix"
            :label="t('labels.suffix')"
            density="compact"
            variant="solo"
            single-line
            hide-details
            clearable
            :disabled="isDisabled"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" :md="state.removeText ? '' : '5'">
          <v-text-field
            v-model="state.findText"
            :label="t('labels.find')"
            density="compact"
            variant="solo"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            clearable
            :disabled="isDisabled"
          ></v-text-field>
        </v-col>
        <v-col :class="{ 'd-none': state.removeText }">
          <v-text-field
            v-model="state.replaceText"
            :label="t('labels.replace')"
            density="compact"
            variant="solo"
            single-line
            hide-details
            clearable
            :disabled="state.removeText || isDisabled"
          ></v-text-field>
        </v-col>
        <v-col
          cols="auto"
          md="auto"
          :class="
            isDisabled
              ? 'v-field v-field--variant-solo d-block rounded  py-0 my-1 mx-1 v-field--disabled'
              : 'v-field v-field--variant-solo d-block rounded py-0 my-1 mx-1'
          "
        >
          <v-checkbox
            v-model="state.removeText"
            :label="t('labels.remove')"
            density="compact"
            color="cyan-darken-1"
            single-line
            hide-details
            variant="solo"
            :disabled="isDisabled"
            class="mx-2 mr-3"
          >
            <v-tooltip activator="parent" location="top">{{ t('titles.remove') }}</v-tooltip>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row no-gutters class="mx-3">
    <v-col class="pt-1 my-0 pe-0">
      <span class="text-grey ml-2">{{ t('labels.filename') }} ({{ numFiltered }}) </span>
      <v-btn
        density="compact"
        @click="copyToClipboard"
        class="copy-btn pb-1"
        variant="plain"
        :color="isDark ? 'cyan-darken-1' : 'cyan-darken-4'"
        :loading="copying"
        :ripple="false"
        :disabled="isDisabled"
        :title="t('titles.copy')"
      >
        <v-icon icon="mdi-clipboard-multiple-outline"></v-icon>
        <template v-slot:loader>
          <v-icon icon="mdi-check-bold" class="mb-1"> </v-icon>
          <v-tooltip v-model="copying" activator="parent" location="top" class="mini-tooltip">{{
            t('titles.copied')
          }}</v-tooltip>
        </template>
      </v-btn>
    </v-col>
    <v-col class="pt-1 my-0 pe-1 text-right">
      <v-row no-gutters class="stripped" justify="end">
        <v-col class="py-0 my-0 pl-1 d-none d-sm-block text-right"> </v-col>
        <v-col class="py-0 my-0 text-end" cols="1" sm="4">
          <v-btn
            density="compact"
            @click="clearAll"
            class="copy-btn"
            variant="plain"
            color="error"
            :ripple="false"
            :disabled="isDisabled"
            :title="t('titles.wipe')"
          >
            <v-icon icon="mdi-close-box-multiple-outline"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row no-gutters class="mx-3">
    <v-col class="m-0 p-0">
      <v-alert
        closable
        v-model="state.alert"
        density="compact"
        type="error"
        :variant="isDark ? 'tonal' : 'elevated'"
        title="Error"
      >
        <pre>{{ state.alertMsg }}</pre>
      </v-alert>
    </v-col>
  </v-row>
  <v-row no-gutters class="mx-3 justify-center">
    <v-col cols="12">
      <v-progress-linear
        indeterminate
        color="warning"
        class="mb-0"
        :active="state.isUpdating"
      ></v-progress-linear>
      <v-dialog
        v-model="state.isLoading"
        persistent
        transition="dialog-bottom-transition"
        class="w-100"
      >
        <v-row no-gutters class="mx-3 justify-center">
          <v-col cols="12" md="6">
            <v-card class="w-100">
              <v-card-title class="text-h5 text-center"> {{ t('text.loading') }} </v-card-title>
              <v-card-text>
                <v-progress-linear
                  :model-value="progress"
                  height="15"
                  striped
                  color="cyan-darken-1"
                  :active="state.isLoading"
                ></v-progress-linear>
              </v-card-text>
              <v-card-actions>
                <v-row dense no-gutters justify="center">
                  <v-col class="col-auto">
                    <v-btn
                      color="warning"
                      :variant="isDark ? 'tonal' : 'elevated'"
                      @click="cancelLoad()"
                      :title="t('titles.cancel')"
                    >
                      {{ t('buttons.cancel') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-dialog>
      <v-dialog
        v-model="state.isRenaming"
        persistent
        transition="dialog-bottom-transition"
        class="w-100"
      >
        <v-row no-gutters class="mx-3 justify-center">
          <v-col cols="12" md="6">
            <v-card class="w-100">
              <v-card-title class="text-h5 text-center"> {{ t('text.renaming') }} </v-card-title>
              <v-card-text>
                <v-progress-linear
                  :model-value="progress"
                  height="15"
                  striped
                  color="warning"
                  :active="state.isRenaming"
                ></v-progress-linear>
              </v-card-text>
              <v-card-actions>
                <v-row dense no-gutters justify="center">
                  <v-col class="col-auto">
                    <v-btn
                      color="warning"
                      :variant="isDark ? 'tonal' : 'elevated'"
                      @click="cancelRename()"
                      :title="t('titles.cancel')"
                    >
                      {{ t('buttons.cancel') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-dialog>
    </v-col>
  </v-row>
  <v-row
    class="h-100 overflow-y-auto mb-3 mt-0 mx-3 border-2 justify-center v-field-label files"
    no-gutters
  >
    <v-col class="py-0 my-0 ps-1 overflow-x-auto" v-if="!showData || !numFiltered">
      <pre>{{ t('text.nofiles') }}</pre>
    </v-col>
    <v-col class="py-0 my-0 ps-1 overflow-x-auto" v-if="showData">
      <pre
        ref="textRef"
        @keydown="backupText"
        @keyup="getText"
        disabled="state.isLoading"
        contenteditable
        >{{ text.selectedText }}</pre
      >
    </v-col>
    <v-col class="py-0 my-0 ps-1 col-auto" v-if="showData">
      <pre ref="dateRef">{{ text.selectedDates }}</pre>
    </v-col>
    <v-col class="py-0 my-0 text-right col-auto" v-if="showData">
      <button
        type="button"
        v-for="file in filteredFiles"
        :key="file"
        class="v-btn--variant-plain d-block prebutton"
        v-on:click="delFile(file)"
        :title="t('titles.del')"
      >
        <v-icon icon="mdi-close-box-outline" color="error"></v-icon>
      </button>
    </v-col>
  </v-row>
</template>

<style>
article {
  width: 100%;
  min-width: 100%;
}
pre {
  line-height: 2em;
  padding: 0px;
  min-width: 100%;
}
[contenteditable] {
  outline: 0px solid transparent;
  border-color: black !important;
  border-width: 0px !important;
}

.prebutton,
.prebutton * {
  padding-bottom: 8px;
  margin-left: 0.05em;
  margin-right: 0.1em;
  max-height: 30px !important;
  min-height: 0px !important;
  --v-icon-size-multiplier: 1 !important;
  font-size: 1.25rem !important;
}

.col-auto {
  -webkit-box-flex: 0 !important;
  -ms-flex: 0 0 auto !important;
  flex: 0 0 auto !important;
  width: auto !important;
  max-width: none !important;
}
.clear-btn {
  min-width: auto !important;
  padding-left: 0.75em !important;
  padding-right: 0.75em !important;
}
.copy-btn {
  min-width: auto !important;
  min-height: auto !important;
  height: auto;
  line-height: 1px !important;
  margin: 0em 0em 0em 0em !important;
  padding: 0em 0.25em 0em 0.25em !important;
}

.mh-100 {
  min-height: 100%;
}
pre.selectable {
  pointer-events: stroke;
}

.fancyscroll {
  overflow-x: hidden !important;
}

.fancyscroll .v-slide-group__next,
.fancyscroll .v-slide-group__prev {
  min-width: 22.5px;
  max-width: 22.5px;
}

.border-bottom {
  border-bottom: 2px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.border-2 {
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.files {
  color: rgba(var(--v-border-color), 0.7);
  background-color: rgba(var(--v-bg-color), var(--v-border-opacity));
}

::selection {
  color: rgb(var(--v-theme-on-background)) !important;
  background: rgba(var(--v-theme-warning), var(--v-disabled-opacity)) !important;
}
</style>

<script setup>
import { dialog, invoke } from '@tauri-apps/api'
import { readDir, renameFile } from '@tauri-apps/api/fs'
import { ref, computed, reactive, watch, toRaw } from 'vue'
import dayjs from 'dayjs'
import ButtonConfirm from './ButtonConfirm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  isDark: Boolean
})

// Equivalent to tracked properties:
const state = reactive({
  selectedFiles: [],
  previousFiles: [],
  fileFilter: '',
  renameErrors: [],
  preTime: false,
  preNum: false,
  prefix: '',
  suffix: '',
  posNum: false,
  posTime: false,
  findText: '',
  replaceText: '',
  removeText: false,
  alert: false,
  alertMsg: '',
  elements: [],
  stopLoading: false,
  stopRenaming: false,
  isRenaming: false,
  isLoading: false,
  isUpdating: false
})

const rFiles = reactive({
  selectedFiles: [],
  previousFiles: [],
  fileFilterRegex: '',
  loadingTimeout: ''
})

const text = reactive({
  selectedDates: '',
  selectedText: '',
  backupText: '',
  prevDates: '',
  prevText: '',
  lastCursor: '',
  isKeydown: false
})

const dateRef = ref('')
const textRef = ref('')
const progress = ref(0)
const copying = ref(false)
const numSelected = ref(0)
const numFiltered = ref(0)

watch(copying, (val) => {
  if (val) {
    setTimeout(() => (copying.value = false), 1500)
  }
})

const items = ['number', 'prefix', 'name', 'suffix', 'date', 'time']

watch(state, () => {
  if (!state.isLoading && !state.stopLoading && !state.stopRenaming && !state.isRenaming) {

    if (filteredFiles.value.length != numSelected.value) {
      numSelected.value = state.selectedFiles.length
    }

    let list = toRaw(filteredFiles.value)
    if (list.length != numFiltered.value) {
      numFiltered.value = list.length
    }

    let newText = filterText(list)
    text.selectedText = text.backupText || newText
    text.prevText = text.backupText || newText
    text.backupText = ''

    text.selectedDates = list.map((item) => niceDate(item.date)).join('\n')

    clearTimeout(rFiles.loadingTimeout)
    rFiles.loadingTimeout = setTimeout(() => {
      state.isUpdating = false
    }, 500)
  }
})

function filterText(list) {
  let newText = ''
  if (list.length > 0) {
    let textLines = []

    // Find-replace functionality
    let findText = ''
    let replaceText = ''
    if (state.findText != null && state.findText) {
      findText = state.findText
      try {
        findText = new RegExp(findText, 'gi')
      } catch (error) {
        if (error instanceof Error) {
          state.alertMsg = error.message
          state.alert = true
        } else {
          state.alertMsg = ''
          state.alert = false
        }
        findText = ''
      } finally {
        if (findText) {
          state.alertMsg = ''
          state.alert = false
        }
      }
    }
    if (state.replaceText != null && state.replaceText) {
      replaceText = state.replaceText.replace(/[^a-zA-Z0-9\s_.-]/g, '')
    }

    if (state.elements.length > 0 || state.prefix || state.suffix || state.findText) {
      let numDigits = 0
      numDigits = list.length
      numDigits = Math.floor(Math.log10(numDigits) + 1)

      let structure = ''
      if (state.elements.length > 0) {
        structure = '\\' + state.elements.join('-\\')
      }

      let listNr = 0
      list.forEach((item) => {
        listNr = String(Number(listNr) + 1)
        let finalname = item.name
        let finalExtension = item.extension
        let date = dayjs(item.date).format('YYYYMMDD').toString()
        let time = dayjs(item.date).format('HHmmss').toString()
        let numString = listNr.padStart(numDigits, 0)
        let prefix = state.prefix != null ? state.prefix : ''
        let suffix = state.suffix != null ? state.suffix : ''

        if (state.elements.length > 0) {
          finalname = structure.replaceAll('\\number', numString)
          finalname = String(finalname).replaceAll('\\date', date)
          finalname = String(finalname).replaceAll('\\time', time)
          if (prefix) {
            finalname = finalname.replaceAll('\\prefix', prefix)
          } else {
            finalname = finalname.replaceAll('-\\prefix', '')
            finalname = finalname.replaceAll('\\prefix', '')
          }
          if (suffix) {
            finalname = finalname.replaceAll('\\suffix', suffix)
          } else {
            finalname = finalname.replaceAll('-\\suffix', '')
            finalname = finalname.replaceAll('\\suffix', '')
          }
          finalname = finalname.replaceAll('\\name', item.name)
        }

        if (findText && replaceText && !state.removeText) {
          finalname = finalname.replaceAll(findText, replaceText)
        } else {
          if (findText && state.removeText) {
            finalname = finalname.replaceAll(findText, '')
          }
        }

        if (finalExtension) {
          finalname = finalname + '.' + finalExtension
        }

        textLines.push(finalname)
      })
    } else {
      textLines = list.map((item) => item.newfullname)
    }
    newText = textLines.join('\n')
  }
  return newText
}

function filterFiles(){
  
}

// Equivalent to Ember computed / tracked+getters:

const filteredFiles = computed(() => {
  let list = state.selectedFiles
  if (list.length > 0) {
    if (state.fileFilter) {
      // Find-replace functionality
      let filterRegex = rFiles.fileFilterRegex;
      let filter = state.alert ? state.fileFilter.toLowerCase() : filterRegex
      if(filterRegex){
        list = list.filter((item) => item.name.toLowerCase().match(filter))
      } else {        
        list = list.filter((item) => item.name.toLowerCase().includes(filter))
      }
    }
  }
  return list
})

const isDisabled = computed(() => {
  if (numFiltered.value > 0) {
    return false
  }
  return true
})

const disableFilter = computed(() => {
  if (numSelected.value > 0) {
    return false
  }
  return true
})

const showData = computed(() => {
  if (state.isLoading || state.isUpdating) {
    return false
  }
  return true
})

// Equivalent to Ember actions:

/**
 * Filters down the event.
 *
 * @param {Event} event - The event to filter down.
 * @return {void} No return value.
 */
function filterDown(event) {
  let keycode = event.keyCode

  let valid =
    (keycode > 47 && keycode < 58) || // number keys
    keycode == 8 || // backspace
    keycode == 32 ||
    keycode == 13 || // spacebar & return key(s) (if you want to allow carriage returns)
    (keycode > 64 && keycode < 91) || // letter keys
    (keycode > 95 && keycode < 112) || // numpad keys
    (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    (keycode > 218 && keycode < 223) // [\]' (in order)
  if (valid) {
    restoreNames()
    state.isUpdating = true
    if (state.fileFilter != null && state.fileFilter) {
      let regexFilter = state.fileFilter       
      try {
        regexFilter = new RegExp(state.fileFilter, 'gi')
      } catch (error) {
        if (error instanceof Error) {
          state.alertMsg = error.message
          state.alert = true
        } else {
          state.alertMsg = ''
          state.alert = false
        }
        regexFilter = ''
      } finally {
        if (regexFilter) {
          state.alertMsg = ''
          state.alert = false
        }
      }
      rFiles.fileFilterRegex = regexFilter
    }
  }
}

function restoreNames() {
  state.renameErrors = []
  state.prefix = ''
  state.suffix = ''
  state.findText = ''
  state.replaceText = ''
  state.removeText = false
  // state.fileFilter = ''
  state.alert = false
  state.alertMsg = ''
  state.elements = []
  text.selectedText = ''
  text.prevText = ''
  text.lastCursor = ''
  text.isKeydown = false
}

function clearAll() {
  state.selectedFiles = []
  state.previousFiles = []
  state.fileFilter = ''
  state.renameErrors = []
  state.preTime = false
  state.preNum = false
  state.prefix = ''
  state.suffix = ''
  state.posNum = false
  state.posTime = false
  state.findText = ''
  state.replaceText = ''
  state.removeText = false
  state.alert = false
  state.alertMsg = ''
  state.elements = []
  state.stopLoading = false
  state.stopRenaming = false
  state.isRenaming = false
  state.isLoading = false
  state.isUpdating = false

  rFiles.selectedFiles = []
  rFiles.previousFiles = []
  rFiles.loadingTimeout = ''

  text.selectedDates = ''
  text.selectedText = ''
  text.backupText = ''
  text.prevDates = ''
  text.prevText = ''
  text.lastCursor = ''
  text.isKeydown = false

  dateRef.value = ''
  textRef.value = ''
  progress.value = 0
  copying.value = false
  numSelected.value = 0
  numFiltered.value = 0
}

function copyToClipboard() {
  copying.value = true
  navigator.clipboard.writeText(text.selectedText)
}

function clearElements() {
  state.elements = []
}
function addElement(item) {
  if (item) {
    state.elements.push(item)
  }
}
function removeElement(index) {
  if (!isNaN(index)) {
    state.elements.splice(index, 1)
  }
}

function toggleToLower() {
  let textLines = textRef.value.innerText.trim().split(/\n/)
  let lowercased = []
  let i = 0
  while (i < textLines.length) {
    let fullName = textLines[i]
    let newExtension = fullName.split('.').slice(-1).toString()
    let newName = fullName.replace('.' + newExtension, '').toLowerCase()
    if (!newExtension || !newName) {
      lowercased.push(fullName.toLowerCase())
    } else {
      lowercased.push(newName + '.' + newExtension)
    }
    i++
  }
  text.prevText = text.selectedText
  text.selectedText = lowercased.join('\n')
}

function toggleToUpper() {
  let textLines = textRef.value.innerText.trim().split(/\n/)
  let lowercased = []
  let i = 0
  while (i < textLines.length) {
    let fullName = textLines[i]
    let newExtension = fullName.split('.').slice(-1).toString()
    let newName = fullName.replace('.' + newExtension, '').toUpperCase()
    if (!newExtension || !newName) {
      lowercased.push(fullName.toUpperCase())
    } else {
      lowercased.push(newName + '.' + newExtension)
    }
    i++
  }
  text.prevText = text.selectedText
  text.selectedText = lowercased.join('\n')
}

function niceDate(date) {
  if (date) {
    return dayjs(date).format('YYYY/MM/DD, HH:mm:ss')
  } else {
    return 'No date'
  }
}

function cancelLoad() {
  state.stopLoading = true
}
function cancelRename() {
  state.stopRenaming = true
}

// Keydown checks:
function backupText() {
  if (!text.isKeydown) {
    let textLines = textRef.value.innerText.trim().split(/\n/).length

    let prevLines = text.prevText.split(/\n/).length

    let selection = document.getSelection()
    text.lastCursor = selection.anchorOffset

    if (prevLines == textLines) {
      text.prevText = textRef.value.innerText
    }
  }
  text.isKeydown = true
}

// keyup checks:
function getText() {
  text.isKeydown = false
  // text.selectedText = textRef.value.innerText.trim().split(/\r?\n/)
  let backupLines = text.prevText.split(/\n/).length
  let textLines = textRef.value.innerText.trim().split(/\n/)
  let selected = toRaw(filteredFiles.value)

  let i = 0
  let restore = false

  if (textLines.length < backupLines || textLines.length > backupLines) {
    //console.debug('You deleted the wrong thing!');
    textRef.value.textContent = text.prevText

    let selectedText = window.getSelection()
    let selectedRange = document.createRange()
    selectedRange.setStart(textRef.value.childNodes[0], text.lastCursor)
    selectedRange.collapse(true)
    selectedText.removeAllRanges()
    selectedText.addRange(selectedRange)
    textRef.value.focus()
  } else {
    do {
      if (!textLines[i]) {
        restore = true
        if (selected[i]) {
          textLines[i] = selected[i].newfullname
        }
      }
      i = i + 1
    } while (i < selected.length)

    if (restore) {
      text.selectedText = textLines.join('\n')
    }
    text.prevText = text.selectedText
  }
}

function openFolder() {
  dialog.open({ directory: true }).then((directory) => {
    // console.debug(directory);
    if (directory != null && directory) {
      readDir(directory, { recursive: false }).then(async (files) => {
        if (files.length > 0) {
          let prevText = ''
          if (filteredFiles.value.length > 0) {
            rFiles.previousFiles = toRaw(filteredFiles.value)
            prevText = toRaw(textRef.value.innerText)
          }
          clearAll()
          let totalLenght = files.length
          state.isLoading = true
          let filecounter = 0
          let folders = 0
          for (var i = 0; i < files.length; i++) {
            if (state.stopLoading) {
              clearAll()
              state.isLoading = false
              state.stopLoading = false
              process.value = 0
              state.selectedFiles = toRaw(rFiles.previousFiles)
              text.backupText = prevText
              break
            } else {
              let file = files[i]
              let pathInfo = await invoke('get_path_info', { filePath: file.path })
              if (!pathInfo.is_folder) {
                let modified = pathInfo.modified.secs_since_epoch * 1000
                let fullfilename = file.name
                let filepath = file.path.replace(fullfilename, '')
                let extension = ''
                if (fullfilename.includes('.')) {
                  extension = fullfilename.split('.').slice(-1).toString()
                }
                let filename = fullfilename.replace('.' + extension, '')
                let newId = 'file' + filecounter

                let newFile = {
                  id: newId,
                  name: filename,
                  extension: extension,
                  path: filepath,
                  date: modified,
                  fullname: fullfilename,
                  newfullname: fullfilename,
                  saved: false
                }

                await state.selectedFiles.push(newFile)

                filecounter += 1
              } else {
                folders += 1
              }
              if (filecounter == totalLenght - folders) {
                setTimeout(() => {
                  progress.value = 0
                  state.isLoading = false
                }, 500)
              } else {
                progress.value = Math.ceil((filecounter * 100) / (totalLenght - folders))
              }
            }
          }
        }
      })
    }
  })
}

function selectFiles() {
  dialog
    .open({
      directory: false,
      multiple: true,
      title: 'Select files to rename' /*, filters: filter */
    })
    .then(async (files) => {
      // console.debug(files);
      if (files) {
        if (files.length > 0) {
          let prevText = ''
          if (filteredFiles.value.length > 0) {
            rFiles.previousFiles = toRaw(filteredFiles.value)
            prevText = toRaw(textRef.value.innerText)
          }
          clearAll()
          let totalLenght = files.length
          state.isLoading = true
          let filecounter = 0
          let folders = 0
          //files.map(async (file) => {
          for (var i = 0; i < files.length; i++) {
            if (state.stopLoading) {
              clearAll()
              state.isLoading = false
              state.stopLoading = false
              process.value = 0
              state.selectedFiles = toRaw(rFiles.previousFiles)
              text.backupText = prevText
              break
            } else {
              let file = files[i]
              let pathInfo = await invoke('get_path_info', { filePath: file })
              if (!pathInfo.is_folder) {
                let modified = pathInfo.modified.secs_since_epoch * 1000
                let filedata = file.split('\\')
                let fullfilename = filedata.pop().toString()
                let filepath = file.replace(fullfilename, '')
                let extension = ''
                if (fullfilename.includes('.')) {
                  extension = fullfilename.split('.').slice(-1).toString()
                }
                let filename = fullfilename.replace('.' + extension, '')
                let newId = 'file' + filecounter

                let newFile = {
                  id: newId,
                  name: filename,
                  extension: extension,
                  path: filepath,
                  date: modified,
                  fullname: fullfilename,
                  newfullname: fullfilename,
                  saved: false
                }

                await state.selectedFiles.push(newFile)

                filecounter += 1
              } else {
                folders += 1
              }

              if (filecounter == totalLenght - folders) {
                setTimeout(() => {
                  progress.value = 0
                  state.isLoading = false
                }, 500)
              } else {
                progress.value = Math.ceil((filecounter * 100) / (totalLenght - folders))
              }
            }
          }
        }
      }
    })
}

async function saveFiles() {
  // We need to save the status of each file: if it has been saved or not, and update it after saving it.

  let updated = false
  state.renameErrors = []
  state.alertMsg = ''
  state.alert = false

  var selected = toRaw(filteredFiles.value)
  var modified = textRef.value.innerText.trim().split(/\n/)
  let haveDuplicates = modified.filter((item, index) => modified.indexOf(item) !== index)
  let tooLong = modified.length > selected.length
  let targetLength = Number(selected.length)

  console.debug('Too much text?: ', tooLong)
  console.debug('Duplicates: ', haveDuplicates)

  if (haveDuplicates.length == 0 && !tooLong) {
    if (targetLength == modified.length) {
      let prevText = ''
      if (filteredFiles.value.length > 0) {
        rFiles.previousFiles = toRaw(filteredFiles.value)
        prevText = toRaw(textRef.value.innerText)
      }
      state.isRenaming = true
      let filecounter = 0
      let i = 0
      /*state.selectedFiles = []*/
      state.prefix = ''
      state.suffix = ''
      state.findText = ''
      state.replaceText = ''
      state.elements = []
      state.removeText = false

      while (i < targetLength) {
        if (state.stopRenaming) {
          //clearAll()
          process.value = 0
          state.isRenaming = false
          state.stopRenaming = false
          // state.selectedFiles = toRaw(rFiles.previousFiles)
          // text.backupText = prevText
          break
        } else {
          //if(selected[i].id == 'file'+i){
          let newFullName = modified[i]
          let newExtension = newFullName.split('.').slice(-1).toString()
          let newName = newFullName.replace('.' + newExtension, '')
          let initialPath = selected[i].path + selected[i].fullname
          let newPath = selected[i].path + modified[i]
          let updating = selected[i]

          updating.newfullname = newFullName

          if (updating.newfullname != updating.fullname) {
            await renameFile(initialPath, newPath).then(
              (success) => {
                console.debug(success)
                updated = true
                console.debug('Initial: ', initialPath)
                console.debug('Newpath: ', newPath)
                updating.fullname = newFullName
                updating.name = newName
                updating.extension = newExtension
                updating.saved = true
                filteredFiles.value[i] = updating
                console.debug('File renamed successfully')
              },
              (error) => {
                console.debug('Initial: ', initialPath)
                console.debug('Newpath: ', newPath)
                updating.saved = false
                filteredFiles.value[i] = updating
                state.renameErrors.push(error)
                console.debug(error)
              }
            )
          } else {
            updating.saved = false
            filteredFiles.value[i] = updating
          }

          filecounter++

          if (filecounter + 1 == targetLength) {
            setTimeout(() => {
              progress.value = 0
              state.fileFilter = ''
              state.isRenaming = false
            }, 500)
          } else {
            progress.value = Math.ceil(((filecounter + 1) * 100) / targetLength)
          }
          i++
        }
      }
    }

    if (state.renameErrors.length > 0) {
      console.debug(state.renameErrors)
    } else {
      if (updated) {
        console.debug('Updating files array')
        state.prefix = ''
        state.suffix = ''
        state.findText = ''
        state.replaceText = ''
        state.elements = []
        state.removeText = false
        // state.selectedFiles = selected;
      }
    }
  } else {
    setTimeout(() => {
      state.isRenaming = false
      progress.value = 0
    }, 1000)
    if (haveDuplicates.length > 0) {
      haveDuplicates.forEach((fileErr) => {
        state.alertMsg += 'The file name ' + fileErr + ' is duplicated.\n'
      })
    }
    if (tooLong) {
      state.alertMsg += 'There are more names than files!.\n'
    }
    state.alert = true
  }
}

async function delFile(removed) {
  let prevText = textRef.value.innerText.trim()
  prevText = prevText.split(/\r?\n/)
  /*let updatedText = ''
  let removedText = ''
  if (removed.extension) {
    removedText = removed.name + '.' + removed.extension + '\n'
  } else {
    removedText = removed.name + '\n'
  }*/

  let selectedFiles = toRaw(filteredFiles.value)
  let i = 0
  do {
    let current = selectedFiles[i]
    let selFileText = ''
    if (current.extension) {
      selFileText = current.name + '.' + current.extension + '\n'
    } else {
      selFileText = current.name + '\n'
    }

    let modified = prevText[i]
    if (modified != selFileText && modified) {
      let extension = ''
      let name = modified ? modified : 'unnamed(' + i + ')'
      if (modified.includes('.')) {
        extension = modified.split('.').slice(-1).toString()
        name = modified.split('.')[0].toString()
      }
      selectedFiles[i].newfullname = name + '.' + extension
      selectedFiles[i].saved = false
    }

    i = i + 1
  } while (i < selectedFiles.length)

  selectedFiles = await selectedFiles.sort(function sortById(a, b) {
    let aID = a.id
    let bID = b.id

    if (aID > bID) {
      return 1
    }
    if (aID == bID) {
      return 0
    }
    if (aID < bID) {
      return -1
    }
  })
  state.selectedFiles = toRaw(await selectedFiles.filter((file) => file.id != removed.id))
}
</script>
