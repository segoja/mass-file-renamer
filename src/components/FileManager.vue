<template>
  <v-row dense class="mx-2 pt-3">
    <v-col cols="12" sm="6">
      <v-row dense no-gutters class="mh-100">
        <v-col class="mh-100 pr-2">
          <v-btn
            append-icon="mdi-folder"
            @click="openFolder"
            variant="tonal"
            color="secondary"
            :class="isDark ? 'w-100 mh-100' : 'w-100 mh-100 v-btn--variant-outlined'"
            title="Select folder"
          >
            Folder
          </v-btn>
        </v-col>
        <v-col class="mh-100 pr-2">
          <v-btn
            append-icon="mdi-file"
            @click="selectFiles"
            variant="tonal"
            color="secondary"
            :class="isDark ? 'w-100 mh-100' : 'w-100 mh-100 v-btn--variant-outlined'"
            title="Select files"
          >
            Files
          </v-btn>
        </v-col>
        <v-col class="mh-100 col-auto pr-2">
          <v-btn
            @click="restoreNames"
            color="secondary"
            variant="tonal"
            :disabled="isDisabled"
            :class="isDark ? 'w-100 mh-100' : 'w-100 mh-100 v-btn--variant-outlined'"
            title="Restore names"
          >
            <v-icon size="large" icon="mdi-restore" />
          </v-btn>
        </v-col>
        <v-col class="mh-100">
          <ButtonConfirm
            btnText="Rename"
            btnTitle="Apply name changes"
            btnAppendIcon="mdi-content-save"
            :btnDisabled="isDisabled"
            btnVariant="tonal"
            btnColor="warning"
            :btnClass="isDark ? 'w-100 mh-100' : 'w-100 mh-100 v-btn--variant-outlined'"
            :action="saveFiles"
            msg="Are you sure you want to rename the files?"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="6">
      <v-row no-gutters dense>
        <v-col>
          <v-text-field
            v-model="state.fileFilter"
            label="Filter"
            density="compact"
            variant="solo"
            append-inner-icon="mdi-filter"
            single-line
            hide-details
            clearable
            :disabled="isDisabled"
          />
        </v-col>
        <v-col class="col-auto mh-100">
          <v-btn
            @click="toggleToLower"
            color="secondary"
            variant="tonal"
            :disabled="isDisabled"
            :class="isDark ? 'ml-2 mh-100' : 'ml-2 mh-100 v-btn--variant-outlined'"
            title="To lower case"
          >
            <v-icon size="large" icon="mdi-format-letter-case-lower" />
          </v-btn>
        </v-col>
        <v-col class="col-auto mh-100">
          <v-btn
            @click="toggleToUpper"
            color="secondary"
            variant="tonal"
            :disabled="isDisabled"
            :class="isDark ? 'ml-2 mh-100' : 'ml-2 mh-100 v-btn--variant-outlined'"
            title="To upper case"
          >
            <v-icon size="large" icon="mdi-format-letter-case-upper" />
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row class="mx-2" dense>
    <v-col cols="12" md="6">
      <v-row dense align="center" justify="space-around">
        <v-col justify="end">
          <v-chip-group
            :class="
              isDisabled
                ? 'v-field v-field--variant-solo v-theme--high-contrast d-block v-input rounded py-0 px-1 v-input__control v-field--disabled'
                : 'v-field v-field--variant-solo v-theme--high-contrast d-block v-input rounded py-0 px-1 v-input__control'
            "
            :disabled="isDisabled"
          >
            <v-chip variant="text" label draggable class="v-label my-1 pr-0"> Elements: </v-chip>
            <v-chip
              class="my-0 mx-0 mr-1 py-0"
              v-for="item in items"
              draggable
              label
              :key="item"
              @click="addElement(item)"
              size="small"
            >
              {{ item }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col class="col-auto mh-100">
          <v-btn
            @click="clearElements"
            variant="tonal"
            color="secondary"
            :disabled="!state.elements.length"
            :class="isDark ? 'mh-100 h-100' : 'mh-100 h-100 v-btn--variant-outlined'"
            title="Clear template"
          >
            <span class="mr-1 py-2 mt-1">{{ state.elements.length }}</span>
            <v-icon size="large" icon="mdi-eraser" />
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-chip-group
            :class="
              isDisabled
                ? 'v-field v-field--variant-solo v-theme--high-contrast d-block v-input rounded  py-0 px-1 d-block w-100 h-100 v-field--disabled'
                : 'v-field v-field--variant-solo v-theme--high-contrast d-block v-input rounded py-0 px-1 d-block w-100 h-100'
            "
            :disabled="isDisabled"
          >
            <v-row no-gutters dense align="center" justify="start">
              <v-col class="col-auto">
                <v-chip variant="text" label draggable class="v-label my-1 pr-0">
                  Template:
                </v-chip>
              </v-col>
              <v-col class="fancyscroll py-0 my-0" align="center">
                <v-slide-group show-arrows class="w-100 py-0" compact>
                  <v-slide-group-item v-for="(item, index) in state.elements" :key="item">
                    <v-chip
                      label
                      draggable
                      class="my-0 mx-0 mr-1 py-0 text-warning"
                      size="small"
                      @click="removeElement(index)"
                    >
                      {{ item }}
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
            label="Prefix"
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
            label="Suffix"
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
            label="Find"
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
            label="Replace"
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
              ? 'v-field v-field--variant-solo v-theme--high-contrast d-block v-input rounded  py-0 my-1 mx-0 mr-1 v-field--disabled'
              : 'v-field v-field--variant-solo v-theme--high-contrast d-block v-input rounded py-0 my-1 mx-0 mr-1'
          "
        >
          <v-checkbox
            v-model="state.removeText"
            :label="state.removeText ? 'Remove' : 'Rm'"
            title="Remove"
            density="compact"
            color="secondary"
            single-line
            hide-details
            variant="solo"
            :disabled="isDisabled"
          >
          </v-checkbox>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row no-gutters class="mx-3">
    <v-col class="pt-2 my-0 pe-0">
      <span class="text-grey ml-2">File name</span>
    </v-col>
    <v-col class="pt-2 my-0 pe-1 text-right">
      <v-row no-gutters class="stripped" justify="end">
        <v-col class="py-0 my-0 pl-1 d-none d-sm-block text-right"> </v-col>
        <v-col class="py-0 my-0 text-end" cols="1" sm="4">
          <v-btn
            density="compact"
            icon="mdi-close-box-multiple-outline"
            @click="clearAll"
            variant="plain"
            color="error"
            :disabled="isDisabled"
          />
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
        variant="tonal"
        title="Error"
      >
        <pre>{{ state.alertMsg }}</pre>
      </v-alert>
    </v-col>
  </v-row>
  <v-row no-gutters class="mx-3 justify-center">
    <v-col cols="12">
      <v-dialog v-model="isLoading" persistent transition="dialog-bottom-transition" class="w-100">
        <v-row no-gutters class="mx-3 justify-center">
          <v-col cols="12" md="6">
            <v-card class="w-100">
              <v-card-title class="text-h5 text-center"> Loading... </v-card-title>
              <v-card-text>
                <v-progress-linear
                  :model-value="progress"
                  height="15"
                  striped
                  color="secondary"
                  :active="isLoading"
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-dialog>
      <v-dialog v-model="isRenaming" persistent transition="dialog-bottom-transition" class="w-100">
        <v-row no-gutters class="mx-3 justify-center">
          <v-col cols="12" md="6">
            <v-card class="w-100">
              <v-card-title class="text-h5 text-center"> Renaming... </v-card-title>
              <v-card-text>
                <v-progress-linear
                  :model-value="progress"
                  height="15"
                  striped
                  color="warning"
                  :active="isRenaming"
                ></v-progress-linear>
              </v-card-text>
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
    <v-col class="py-0 my-0 ps-1 overflow-x-auto">
      <pre
        ref="textRef"
        @keydown="backupText"
        @keyup="getText"
        disabled="isLoading"
        contenteditable
        >{{ text.selectedText }}</pre
      >
    </v-col>
    <v-col class="py-0 my-0 text-right col-auto">
      <v-row no-gutters v-for="file in filteredFiles" class="" justify="end">
        <v-col class="py-0 my-0 ps-1 d-none d-sm-block align-self-end">
          <pre>{{ niceDate(file.date) }}</pre>
        </v-col>
        <v-col class="py-0 my-0 col-auto">
          <pre
            class="prebutton"
          ><v-btn v-on:click="delFile(file)" density="compact" icon="mdi-close-box-outline"
              variant="plain" color="error"></v-btn></pre>
        </v-col>
      </v-row>
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

.prebutton * {
  max-height: 26px !important;
  min-height: 0px !important;
  --v-icon-size-multiplier: 1 !important;
  font-size: 1.25rem !important;
}
.prebutton i.v-icon {
  top: -1px;
}

.col-auto {
  -webkit-box-flex: 0 !important;
  -ms-flex: 0 0 auto !important;
  flex: 0 0 auto !important;
  width: auto !important;
  max-width: none !important;
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
</style>

<script setup>
import { dialog, invoke } from '@tauri-apps/api'
import { readDir, renameFile } from '@tauri-apps/api/fs'
import { useDate } from 'vuetify/labs/date'
import { ref, computed, reactive, onMounted, onUpdated, watch, isProxy, toRaw } from 'vue'
import dayjs from 'dayjs'
import ButtonConfirm from './ButtonConfirm.vue'

const props = defineProps({
  isDark: false
})
// Equivalent to tracked properties:
const state = reactive({
  selectedFiles: [],
  renameErrors: [],
  preTime: false,
  preNum: false,
  prefix: '',
  suffix: '',
  posNum: false,
  posTime: false,
  toLower: false,
  toUpper: false,
  findText: '',
  replaceText: '',
  removeText: false,
  fileFilter: '',
  alert: false,
  alertMsg: '',
  elements: []
})
const text = reactive({
  selectedText: '',
  prevText: '',
  lastCursor: '',
  isKeydown: false
})

const textRef = ref('')
const progress = ref(0)
const isLoading = ref(false)
const isRenaming = ref(false)

const items = ['number', 'prefix', 'name', 'suffix', 'date', 'time']

watch(state, (newValue, oldValue) => {
  let list = toRaw(filteredFiles.value)
  // console.log(filteredFiles);
  // console.log(list.length);
  let newText = ''
  if (list.length > 0) {
    let textLines = []
    if (state.fileFilter && state.fileFilter != null) {
      let filter = state.fileFilter.toLowerCase()
      list = list.filter((item) => item.name.toLowerCase().includes(filter))
    }

    // Find-replace functionality
    let findText = ''
    let replaceText = ''
    if (state.findText != null) {
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
    if (state.replaceText != null) {
      replaceText = state.replaceText.replace(/[^a-zA-Z0-9\s_\.\-]/g, '')
    }

    if (
      state.elements.length > 0 ||
      state.prefix ||
      state.suffix ||
      state.toLower ||
      state.toUpper ||
      state.findText
    ) {
      console.log('test with prefix or suffix')
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

        if (state.toLower) {
          finalname = finalname.toLowerCase()
        }

        if (state.toUpper) {
          finalname = finalname.toUpperCase()
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
      console.log('No prefix/suffix')
      textLines = list.map((item) => item.newfullname)
    }
    newText = textLines.join('\n')
  }
  text.selectedText = newText
  text.prevText = newText
})

watch(text, (newValue, oldValue) => {})

onUpdated(() => {
  // text content should be the same as current `count.value`
  console.log('Content got updated')
})
// Equivalent to Ember computed / tracked+getters:

const filteredFiles = computed(() => {
  if (state.selectedFiles.length > 0) {
    if (state.fileFilter) {
      let filter = state.fileFilter.toLowerCase()
      return state.selectedFiles.filter((item) => item.name.toLowerCase().includes(filter))
    }
    return state.selectedFiles
  }
  return ''
})

const isDisabled = computed(() => {
  if (state.selectedFiles.length > 0) {
    return false
  }
  return true
})

// Equivalent to Ember actions:

function restoreNames() {
  state.renameErrors = []
  state.prefix = ''
  state.suffix = ''
  state.toLower = false
  state.toUpper = false
  state.findText = ''
  state.replaceText = ''
  state.removeText = false
  state.fileFilter = ''
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
  state.renameErrors = []
  state.prefix = ''
  state.suffix = ''
  state.toLower = false
  state.toUpper = false
  state.findText = ''
  state.replaceText = ''
  state.removeText = false
  state.fileFilter = ''
  state.alert = false
  state.alertMsg = ''
  state.elements = []
  text.selectedText = ''
  text.prevText = ''
  text.lastCursor = ''
  text.isKeydown = false
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
  state.toLower = true
  state.toUpper = false
}

function toggleToUpper() {
  state.toUpper = true
  state.toLower = false
}

function sortById(a, b) {
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
}

function niceDate(date) {
  if (date) {
    return dayjs(date).format('YYYY/MM/DD, HH:mm:ss')
  } else {
    return 'No date'
  }
}

// Keydown checks:
function backupText(event) {
  if (!text.isKeydown) {
    // console.log(event);
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
    //console.log('You deleted the wrong thing!');
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
      readDir(directory, { recursive: false }).then((files) => {
        if (files.length > 0) {
          clearAll()
          let totalLenght = files.length
          isLoading.value = true
          let filecounter = 0
          let folders = 0
          files.map(async (file) => {
            let pathInfo = await invoke('get_path_info', { filePath: file.path })
            if (!pathInfo.is_folder) {
              let modified = pathInfo.modified.secs_since_epoch * 1000
              let filedata = file.path.split('\\')
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
                isLoading.value = false
                progress.value = 0
              }, 500)
            } else {
              progress.value = Math.ceil((filecounter * 100) / (totalLenght - folders))
            }
          })
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
          clearAll()
          let totalLenght = files.length
          isLoading.value = true
          let filecounter = 0
          let folders = 0
          files.map(async (file) => {
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
                isLoading.value = false
                progress.value = 0
              }, 500)
            } else {
              progress.value = Math.ceil((filecounter * 100) / (totalLenght - folders))
            }
          })
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

  console.log('Too much text?: ', tooLong)
  console.log('Duplicates: ', haveDuplicates)

  if (haveDuplicates.length == 0 && !tooLong) {
    if (targetLength == modified.length) {
      isRenaming.value = true
      let filecounter = 0
      let i = 0
      state.selectedFiles = []
      state.prefix = ''
      state.suffix = ''
      state.findText = ''
      state.replaceText = ''
      state.fileFilter = ''
      state.elements = []
      state.removeText = false
      state.toLower = false
      state.toUpper = false

      do {
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
              updated = true
              console.log('Initial: ', initialPath)
              console.log('Newpath: ', newPath)
              updating.fullname = newFullName
              updating.name = newName
              updating.extension = newExtension
              updating.saved = true
              state.selectedFiles.push(updating)
              console.log('File renamed successfully')
            },
            (error) => {
              console.log('Initial: ', initialPath)
              console.log('Newpath: ', newPath)
              updating.saved = false
              state.selectedFiles.push(updating)
              state.renameErrors.push(error)
              console.log(error)
            }
          )
        } else {
          updating.saved = false
          state.selectedFiles.push(updating)
        }

        filecounter++

        if (filecounter + 1 == targetLength) {
          setTimeout(() => {
            isRenaming.value = false
            progress.value = 0
          }, 500)
        } else {
          progress.value = Math.ceil(((filecounter + 1) * 100) / targetLength)
        }
        i++
      } while (i < targetLength)
      /*state.selectedFiles = state.selectedFiles.sort((a, b)=>{
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      })*/
    }

    if (state.renameErrors.length > 0) {
      console.log(state.renameErrors)
    } else {
      if (updated) {
        console.log('Updating files array')
        state.prefix = ''
        state.suffix = ''
        state.findText = ''
        state.replaceText = ''
        state.fileFilter = ''
        state.elements = []
        state.removeText = false
        state.toLower = false
        state.toUpper = false
        // state.selectedFiles = selected;
      }
    }
  } else {
    setTimeout(() => {
      isRenaming.value = false
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
  let updatedText = ''
  let removedText = ''
  if (removed.extension) {
    removedText = removed.name + '.' + removed.extension + '\n'
  } else {
    removedText = removed.name + '\n'
  }

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
