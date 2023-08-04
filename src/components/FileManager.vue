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
            @update:modelValue="filterDown"
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
        <v-col>
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
            <v-col cols="12" :md="state.removeText ? '12' : '6'">
              <v-text-field
                v-model="state.findText"
                :label="state.removeText ? t('titles.remove') : t('labels.find')"
                density="compact"
                variant="solo"
                single-line
                hide-details
                :disabled="isDisabled"
              >
                <template v-slot:append-inner>
                  <v-icon
                    v-if="state.removeText"
                    icon="mdi-eraser-variant"
                    @click="toggleDestructive"
                    variant="tonal"
                    color="warning"
                    role="button"
                    aria-hidden="false"
                    :title="t('titles.remove')"
                  />
                  <v-icon v-if="!state.removeText" icon="mdi-magnify" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6" v-if="!state.removeText">
              <v-text-field
                v-model="state.replaceText"
                :label="t('labels.replace')"
                density="compact"
                variant="solo"
                single-line
                hide-details
                :disabled="isDisabled"
              >
                <template v-slot:append-inner>
                  <v-icon
                    icon="mdi-eraser"
                    @click="toggleDestructive"
                    variant="tonal"
                    color="cyan-darken-1"
                    role="button"
                    aria-hidden="false"
                    :title="t('titles.remove')"
                  />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-auto mh-100">
          <v-btn
            @click="keepReplacedText"
            :variant="isDark ? 'tonal' : 'elevated'"
            :disabled="isDisabled"
            class="mh-100"
            color="cyan-darken-1"
            :title="t('titles.replace')"
          >
            <v-icon icon="mdi-keyboard-return" size="x-large" />
          </v-btn>
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
    <v-col :class="text.selectedText ? 'py-0 my-0 ps-1 overflow-x-auto' : 'd-none'" v-if="showData">
      <pre
        ref="textRef"
        @keydown="backupText"
        @keyup="getText"
        disabled="state.isLoading"
        contenteditable
        class="rowable"
        >{{ text.selectedText }}</pre
      >
    </v-col>
    <v-col
      :class="text.selectedText ? 'py-0 my-0 overflow-x-hidden d-md-none d-lg-flex' : 'd-none'"
      v-if="showData"
    >
      <pre
        ref="initialRef"
        disabled
        :class="isDark ? 'text-grey-darken-3 rowable' : 'text-grey rowable'"
        >{{ text.initialText }}</pre
      >
    </v-col>
    <v-col :class="text.selectedText ? 'py-0 my-0 ps-0 col-auto' : 'd-none'" v-if="showData">
      <pre
        ref="dateRef"
        disabled
        :class="isDark ? 'text-grey-darken-3 rowable' : 'text-grey rowable'"
        >{{ text.selectedDates }}</pre
      >
    </v-col>
    <v-col
      :class="text.selectedText ? 'py-0 my-0 text-right col-auto rowable' : 'd-none'"
      v-if="showData"
    >
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
  <v-row no-gutters class="maxh-25 mx-3 mb-3" v-if="errorSystem.alert">
    <v-col class="h-100 overflow-y-auto rounded">
      <v-alert closable v-model="errorSystem.alert" variant="tonal" type="error" title="Error">
        <pre class="text-caption h-100" style="white-space: pre-wrap">{{
          errorSystem.alertMsg
        }}</pre>
      </v-alert>
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

.rowable {
  background: linear-gradient(transparent 50%, rgba(64, 64, 64, 0.05) 50%);
  background-size: 100% 4em; /* Adjust the height of the stripes here */
  background-position: 0em 2em;
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

.maxh-25 {
  max-height: 25%;
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
  preTime: false,
  preNum: false,
  prefix: '',
  suffix: '',
  posNum: false,
  posTime: false,
  findText: '',
  replaceText: '',
  removeText: false,
  elements: [],
  stopLoading: false,
  stopRenaming: false,
  isRenaming: false,
  isLoading: false,
  isUpdating: false
})

const errorSystem = reactive({
  alert: false,
  alertMsg: '',
  renameErrors: []
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
  initialText: '',
  backupText: '',
  prevDates: '',
  prevText: '',
  lastCursor: '',
  isKeydown: false
})

const dateRef = ref('')
const textRef = ref('')
const initialRef = ref('')
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

// We use a getter to watch the a property of errorSystem reactive object.
watch(
  () => errorSystem.renameErrors,
  (renameErrors) => {
    if (renameErrors.length > 0) {
      errorSystem.alertMsg = renameErrors.join('\n')
      errorSystem.alert = true
    } else {
      errorSystem.alertMsg = ''
      errorSystem.alert = false
    }
    //console.debug('Errors: ', renameErrors.length)
    //console.debug('Alert: ', errorSystem.alert)
  }
)

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

    text.initialText = ''
    text.selectedDates = ''
    for (var i = 0; i < list.length; i++) {
      if (i < list.length - 1) {
        text.initialText += list[i].fullName + '\n'
        text.selectedDates += niceDate(list[i].date) + '\n'
      } else {
        text.initialText += list[i].fullName
        text.selectedDates += niceDate(list[i].date)
      }
    }
    // text.selectedDates = list.map((item) => { niceDate(item.date) }).join('\n')

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
    if (state.findText) {
      findText = state.findText
      try {
        findText = new RegExp(findText, 'gi')
      } catch (error) {
        if (error instanceof Error) {
          errorSystem.renameErrors = [error.message]
        }
        findText = ''
      }
    } else {
      if (errorSystem.renameErrors.length > 0) {
        errorSystem.renameErrors = []
      }
    }

    if (findText && errorSystem.renameErrors.length > 0) {
      errorSystem.renameErrors = []
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
        structure = '\\' + state.elements.join('\\')
      }

      let listNr = 0
      list.forEach((item) => {
        listNr = String(Number(listNr) + 1)

        let finalExtension = item.newExtension
        let finalName = item.newName

        let date = dayjs(item.date).format('YYYYMMDD').toString()
        let time = dayjs(item.date).format('HHmmss').toString()
        let numString = listNr.padStart(numDigits, 0)
        let prefix = state.prefix != null ? state.prefix : ''
        let suffix = state.suffix != null ? state.suffix : ''

        if (state.elements.length > 0) {
          finalName = structure.replaceAll('\\number', numString)
          finalName = String(finalName).replaceAll('\\date', date)
          finalName = String(finalName).replaceAll('\\time', time)
          if (prefix) {
            finalName = finalName.replaceAll('\\prefix', prefix)
          } else {
            finalName = finalName.replaceAll('-\\prefix', '')
            finalName = finalName.replaceAll('\\prefix', '')
          }
          if (suffix) {
            finalName = finalName.replaceAll('\\suffix', suffix)
          } else {
            finalName = finalName.replaceAll('-\\suffix', '')
            finalName = finalName.replaceAll('\\suffix', '')
          }
          finalName = finalName.replaceAll('\\name', item.newName)
        }

        if (finalExtension) {
          finalName = finalName + '.' + finalExtension
        }

        if (findText && replaceText && !state.removeText) {
          finalName = finalName.replaceAll(findText, replaceText)
        } else {
          if (findText && state.removeText) {
            finalName = finalName.replaceAll(findText, '')
          }
        }

        textLines.push(finalName)
      })
    } else {
      textLines = list.map((item) => item.newFullName)
    }
    newText = textLines.join('\n')
  }
  return newText
}

// Equivalent to Ember computed / tracked+getters:

const filteredFiles = computed(() => {
  let list = state.selectedFiles
  if (list.length > 0) {
    if (state.fileFilter) {
      // Find-replace functionality
      let filterRegex = rFiles.fileFilterRegex
      let filter = errorSystem.alert ? state.fileFilter : filterRegex
      if (filterRegex) {
        list = list.filter((item) => item.fullName.match(filter))
      } else {
        list = list.filter((item) => item.fullName.includes(filter))
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

function filterDown() {
  resetChanges()
  state.isUpdating = true
  if (state.fileFilter != null && state.fileFilter) {
    let regexFilter = state.fileFilter
    try {
      regexFilter = new RegExp(state.fileFilter, 'gi')
    } catch (error) {
      if (error instanceof Error) {
        errorSystem.renameErrors = [error.message]
      }
      regexFilter = ''
    }
    rFiles.fileFilterRegex = regexFilter
  }
}

function restoreNames() {
  const list = filteredFiles.value
  list.forEach((item) => {
    item.newName = item.name
    item.newExtension = item.extension
    item.newFullName = item.fullName
  })
  resetChanges()
  /*let newText = filterText(toRaw(list))
  resetChanges()
  textRef.value.innerText = newText
  text.selectedText = newText*/
  text.prevText = ''
  text.backupText = ''
}

function resetChanges() {
  errorSystem.renameErrors = []
  state.prefix = ''
  state.suffix = ''
  state.findText = ''
  state.replaceText = ''
  state.removeText = false
  // state.fileFilter = ''
  errorSystem.alert = false
  errorSystem.alertMsg = ''
  state.elements = []
  text.lastCursor = ''
  text.isKeydown = false

  text.backupText = ''
  text.selectedText = ''
  text.prevText = ''
}

function clearAll() {
  state.selectedFiles = []
  state.previousFiles = []
  state.fileFilter = ''
  errorSystem.renameErrors = []
  state.preTime = false
  state.preNum = false
  state.prefix = ''
  state.suffix = ''
  state.posNum = false
  state.posTime = false
  state.findText = ''
  state.replaceText = ''
  state.removeText = false
  errorSystem.alert = false
  errorSystem.alertMsg = ''
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

function toggleDestructive() {
  state.removeText = !state.removeText
}

function keepReplacedText() {
  const latestText = toRaw(textRef.value.innerText)
  const latestReplaced = latestText.trim().split(/\n/)
  const selectedFiles = filteredFiles.value

  if (latestReplaced.length === selectedFiles.length) {
    for (var i = 0; i < selectedFiles.length; i++) {
      let newFullName = latestReplaced[i]
      let newExtension = newFullName.split('.').slice(-1).toString()
      let newName = newFullName.replace('.' + newExtension, '')

      selectedFiles[i].newFullName = newFullName
      selectedFiles[i].newName = newName
      selectedFiles[i].newExtension = newExtension
    }
    state.findText = ''
    state.replaceText = ''
    resetChanges()
  }
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
          textLines[i] = selected[i].newFullName
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
              progress.value = 0
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
                  fullName: fullfilename,
                  path: filepath,
                  date: modified,
                  newName: filename,
                  newExtension: extension,
                  newFullName: fullfilename,
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
              progress.value = 0
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
                  fullName: fullfilename,
                  path: filepath,
                  date: modified,
                  newName: filename,
                  newExtension: extension,
                  newFullName: fullfilename,
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
  errorSystem.renameErrors = []
  errorSystem.alertMsg = ''
  errorSystem.alert = false

  var selected = toRaw(filteredFiles.value)
  var modified = textRef.value.innerText.trim().split(/\n/)
  let haveDuplicates = modified.filter((item, index) => modified.indexOf(item) !== index)
  let tooLong = modified.length > selected.length
  let targetLength = Number(selected.length)

  console.debug('Too much text?: ', tooLong)
  console.debug('Duplicates: ', haveDuplicates)

  if (haveDuplicates.length == 0 && !tooLong) {
    if (targetLength == modified.length) {
      //let prevText = ''
      if (filteredFiles.value.length > 0) {
        rFiles.previousFiles = toRaw(filteredFiles.value)
        //prevText = toRaw(textRef.value.innerText)
      }
      state.isRenaming = true
      let filecounter = 0
      /*state.selectedFiles = []*/
      state.prefix = ''
      state.suffix = ''
      state.findText = ''
      state.replaceText = ''
      state.elements = []
      state.removeText = false

      for (var i = 0; i < targetLength; i++) {
        if (state.stopRenaming) {
          //clearAll()
          progress.value = 0
          state.isRenaming = false
          state.stopRenaming = false
          restoreNames()
          // state.selectedFiles = toRaw(rFiles.previousFiles)
          // text.backupText = prevText
          break
        } else {
          //if(selected[i].id == 'file'+i){
          let newFullName = modified[i]
          let newExtension = newFullName.split('.').slice(-1).toString()
          let newName = newFullName.replace('.' + newExtension, '')
          let initialPath = selected[i].path + selected[i].fullName
          let newPath = selected[i].path + modified[i]
          let updating = selected[i]

          updating.newFullName = newFullName
          updating.newName = newName
          updating.newExtension = newExtension

          if (updating.newFullName != updating.fullName) {
            await renameFile(initialPath, newPath).then(
              (success) => {
                console.debug(success)
                updated = true
                console.debug('Initial: ', initialPath)
                console.debug('Newpath: ', newPath)
                updating.fullName = newFullName
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
                errorSystem.renameErrors.push(error)
                console.debug(error)
              }
            )
          } else {
            updating.saved = false
            filteredFiles.value[i] = updating
          }

          filecounter++
          //console.debug('Files processed: ', filecounter);
          //console.debug('Index: ', i);
          //console.debug('Target: ', targetLength);
          if (filecounter == targetLength) {
            progress.value = 100
            setTimeout(() => {
              state.fileFilter = ''
              state.isRenaming = false
              progress.value = 0
            }, 500)
          } else {
            progress.value = Math.ceil((filecounter * 100) / targetLength)
          }
        }
      }
    }

    if (errorSystem.renameErrors.length == 0) {
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
      haveDuplicates.forEach((dupeErr) => {
        errorSystem.renameErrors.push('The file name ' + dupeErr + ' is duplicated.')
      })
    }
    if (tooLong) {
      errorSystem.renameErrors.push('There are more names than files!.')
    }
  }
}

async function delFile(removed) {
  let prevText = textRef.value.innerText.trim()
  prevText = prevText.split(/\r?\n/)

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
      selectedFiles[i].newFullName = name + '.' + extension
      selectedFiles[i].newName = name
      selectedFiles[i].newExtension = extension
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
