<template>
  <v-row dense class="mx-2 pt-3">
    <v-col cols="12" sm="6">
      <v-row dense no-gutters class="mh-100">
        <v-col class="mh-100 pr-0">
          <v-btn
            :append-icon="state.recursive ? 'mdi-folder-multiple' : 'mdi-folder'"
            @click="openFolder"
            :variant="isDark ? 'tonal' : 'elevated'"
            color="cyan-darken-1"
            class="w-100 mh-100"
            :title="t('titles.folder')"
          >
            {{ t('buttons.folder') }}
          </v-btn>
        </v-col>
        <v-col class="mh-100 col-auto pr-0 pl-0">
          <v-btn
            @click="toggleRecursive"
            variant="plain"
            density="compact"
            color="cyan-darken-1"
            class="w-100 mh-100 px-0 mx-0"
            :title="t('titles.recursive')"
          >
            <v-icon
              size="large"
              :icon="state.recursive ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline'"
            />
            <v-icon size="large" icon="mdi-file-tree" />
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
            <v-chip variant="text" label class="v-label my-2 pr-0">
              {{ t('labels.elements') }}
            </v-chip>
            <v-chip
              class="my-2 mx-0 mr-1 py-0 px-2"
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
                ? 'v-field v-field--variant-solo d-block rounded my-0 py-1 px-1 w-100 h-100 v-field--disabled'
                : 'v-field v-field--variant-solo d-block rounded my-0 py-1 px-1 w-100 h-100'
            "
            :disabled="isDisabled"
          >
            <v-row no-gutters dense align="center" justify="start">
              <v-col class="col-auto" cols="auto">
                <v-chip variant="text" label class="v-label my-1 pr-0" draggable>
                  {{ t('labels.template') }}
                </v-chip>
              </v-col>
              <v-col class="py-0 my-0" align="center">
                <v-slide-group class="py-0 d-flex px-0" show-arrows mobile-breakpoint="xs">
                  <v-slide-group-item v-for="(item, index) in state.elements" :key="item">
                    <v-chip
                      label
                      draggable
                      class="my-0 mx-0 mr-1 px-2 py-0 text-warning"
                      size="small"
                      @click="removeElement(index)"
                      v-if="item !== 'number' ? true : false"
                    >
                      {{ t('titles.' + item) }}                      
                    </v-chip>
                    <v-chip
                      label
                      draggable
                      class="my-0 mx-0 mr-1 px-2 py-0 text-warning"
                      size="small"
                      @click="removeElement(index)"
                      v-if="item == 'number' ? true : false"
                      close-icon="mdi-cog"
                    >
                      {{ t('titles.' + item) }}
                      <template #close>
                        <v-icon icon="mdi-cog" @click.stop="toggleNumberModal" :title="t('titles.startnumber')" />
                      </template>
                    </v-chip>
                  </v-slide-group-item>
                </v-slide-group>
                <v-dialog
                  v-model="state.startNumberModal"
                  persistent
                  transition="dialog-bottom-transition"
                  class="w-100"
                  v-if="state.startNumberModal"
                >
                  <v-row no-gutters class="mx-3 justify-center">
                    <v-col cols="12" md="6">
                      <v-card class="w-100">
                        <v-card-title class="text-h5 text-center">{{ t('titles.startnumber') }}</v-card-title>
                        <v-card-text>
                          <v-text-field
                            v-model="state.startNumber"
                            :label="t('titles.startnumber')"
                            density="compact"
                            variant="solo"
                            single-line
                            hide-details
                            clearable
                            placeholder = "1"
                            @click:clear="state.startNumber = 1"
                            :disabled="isDisabled"
                            @update:modelValue="setUpdating"
                            @keypress="onlyNumbers(event)"
                          />
                        </v-card-text>
                        <v-card-actions>
                          <v-row dense no-gutters justify="center">
                            <v-col class="col-auto">
                              <v-btn
                                color="warning"
                                :variant="isDark ? 'tonal' : 'elevated'"
                                @click="toggleNumberModal()"
                                :title="t('titles.close')"
                              >
                                {{ t('buttons.close') }}
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
                @update:modelValue="setUpdating"
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
                @update:modelValue="setUpdating"
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
                @update:modelValue="setUpdating"
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
                @update:modelValue="setUpdating"
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
  <v-row no-gutters class="mx-3 pt-2 justify-center">
    <v-col cols="12">
      <v-progress-linear
        indeterminate
        color="warning"
        :class="state.isUpdating ? 'mb-0 pt-1' : 'mb-0 mt-1'"
        :active="state.isUpdating"
      ></v-progress-linear>
      <v-dialog
        v-model="state.isLoading"
        persistent
        transition="dialog-bottom-transition"
        class="w-100"
        v-if="state.isLoading"
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
                  :indeterminate="rFiles.isReading ? true : !progress"
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
    class="mb-0 mt-2 mx-3 px-0 border-2 h-auto v-field-label files-header"
    no-gutters
    align="start"
  >
    <v-col class="py-0 my-0 ps-1">
      <v-row>
        <v-col>
          <span class="sorter">
            <v-btn
              density="compact"
              @click="sortBy('name')"
              class="copy-btn py-0 px-0 mx-0"
              variant="plain"
              :color="isDark ? 'cyan-lighten-2' : 'cyan-darken-4'"
              :ripple="false"
              :disabled="isDisabled"
              :title="t('labels.by_name')"
            >
              {{ t('labels.by_name') }}
              <v-icon
                :icon="
                  sorting.name
                    ? 'mdi-sort-alphabetical-ascending'
                    : 'mdi-sort-alphabetical-descending'
                "
                class="ms-1"
                v-if="sorting.activeSort == 'name' ? true : false"
              ></v-icon>
              <v-icon
                icon="mdi-sort-alphabetical-ascending"
                class="sorticon ms-1"
                v-if="sorting.activeSort == 'name' ? false : true"
              ></v-icon>
              <v-icon
                icon="mdi-sort-alphabetical-descending"
                class="sorticon"
                v-if="sorting.activeSort == 'name' ? false : true"
              ></v-icon>
            </v-btn>
          </span>
          <span class="sorter">
            <v-btn
              density="compact"
              @click="sortBy('extension')"
              class="copy-btn py-0 px-0 mx-0"
              variant="plain"
              :color="isDark ? 'cyan-lighten-2' : 'cyan-darken-4'"
              :ripple="false"
              :disabled="isDisabled"
              :title="t('labels.by_extension')"
            >
              {{ t('labels.by_extension') }}
              <v-icon
                :icon="
                  sorting.extension
                    ? 'mdi-sort-alphabetical-ascending'
                    : 'mdi-sort-alphabetical-descending'
                "
                class="ms-1"
                v-if="sorting.activeSort == 'extension' ? true : false"
              ></v-icon>
              <v-icon
                icon="mdi-sort-alphabetical-ascending"
                class="sorticon ms-1"
                v-if="sorting.activeSort == 'extension' ? false : true"
              ></v-icon>
              <v-icon
                icon="mdi-sort-alphabetical-descending"
                class="sorticon"
                v-if="sorting.activeSort == 'extension' ? false : true"
              ></v-icon>
            </v-btn>
          </span>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="py-0 my-0 d-md-none d-lg-block">
      <v-btn
        density="compact"
        @click="sortBy('path')"
        class="copy-btn px-0 py-0"
        variant="plain"
        :color="isDark ? 'cyan-lighten-2' : 'cyan-darken-4'"
        :ripple="false"
        :disabled="isDisabled"
        :title="t('labels.by_path')"
      >
        {{ t('labels.by_path') }}
        <v-icon
          :icon="
            sorting.path ? 'mdi-sort-alphabetical-ascending' : 'mdi-sort-alphabetical-descending'
          "
          class="ms-1"
          v-if="sorting.activeSort == 'path' ? true : false"
        ></v-icon>
        <v-icon
          icon="mdi-sort-alphabetical-ascending"
          class="sorticon ms-1"
          v-if="sorting.activeSort == 'path' ? false : true"
        ></v-icon>
        <v-icon
          icon="mdi-sort-alphabetical-descending"
          class="sorticon"
          v-if="sorting.activeSort == 'path' ? false : true"
        ></v-icon>
      </v-btn>
    </v-col>
    <v-col class="py-0 my-0 text-left col-auto mh-0">
      <span class="pe-1">
        <v-btn
          density="compact"
          @click="sortBy('modified')"
          class="copy-btn px-0 py-0"
          variant="plain"
          :color="isDark ? 'cyan-lighten-2' : 'cyan-darken-4'"
          :ripple="false"
          :disabled="isDisabled"
          :title="t('labels.by_modified')"
        >
          {{ t('labels.by_modified') }}
          <v-icon
            :icon="
              sorting.modified ? 'mdi-sort-calendar-ascending' : 'mdi-sort-calendar-descending'
            "
            class="ms-1"
            v-if="sorting.activeSort == 'modified' ? true : false"
          ></v-icon>
          <v-icon
            icon="mdi-sort-calendar-ascending"
            class="sorticon ms-1"
            v-if="sorting.activeSort == 'modified' ? false : true"
          ></v-icon>
          <v-icon
            icon="mdi-sort-calendar-descending"
            class="sorticon"
            v-if="sorting.activeSort == 'modified' ? false : true"
          ></v-icon>
        </v-btn>
      </span>
    </v-col>
    <v-col class="py-0 my-0 ps-3 pe-0 text-right col-auto mh-0">
      <v-btn
        density="compact"
        @click="restoreNames"
        class="copy-btn px-2"
        variant="plain"
        :color="isDark ? 'cyan-darken-1' : 'cyan-darken-3'"
        :ripple="false"
        :disabled="isDisabled"
        :title="t('titles.restore')"
      >
        <v-icon icon="mdi-restore"></v-icon>
      </v-btn>
      <v-btn
        density="compact"
        @click="copyToClipboard"
        class="copy-btn px-0 py-0"
        variant="plain"
        :color="isDark ? 'cyan-darken-1' : 'cyan-darken-3'"
        :loading="copying"
        :ripple="false"
        :disabled="isDisabled"
        :title="t('titles.copy')"
      >
        <v-icon icon="mdi-clipboard-multiple-outline"></v-icon>
        <template v-slot:loader>
          <v-icon icon="mdi-check-bold" class="mb-1"></v-icon>
          <v-tooltip v-model="copying" activator="parent" location="top" class="mini-tooltip">{{
            t('titles.copied')
          }}</v-tooltip>
        </template>
      </v-btn>
      <v-btn
        density="compact"
        @click="clearAll"
        class="copy-btn ps-2"
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
  <v-row
    class="h-100 overflow-y-auto mb-0 mt-0 mx-3 border-2 h-auto justify-center v-field-label files"
    no-gutters
    align="start"
  >
    <v-col class="py-0 my-0 ps-1 overflow-x-auto" v-if="!showData || !numFiltered">
      <pre>{{ state.isUpdating ? t('text.updating') : t('text.nofiles') }}</pre>
    </v-col>
    <v-col
      :class="
        text.selectedText ? 'py-0 my-0 ps-1 overflow-x-auto overflow-y-hidden mh-100' : 'd-none'
      "
      v-if="showData"
    >
      <pre
        ref="textRef"
        @keydown="backupText"
        @keyup="getText"
        :disabled="state.isLoading"
        contenteditable
        class="rowable"
        >{{ text.selectedText }}</pre
      >
    </v-col>
    <v-col
      :class="
        text.selectedText ? 'py-0 my-0 overflow-x-hidden d-md-none d-lg-block mh-100' : 'd-none'
      "
      v-if="showData"
    >
      <pre
        ref="initialRef"
        disabled
        :class="isDark ? 'text-grey-darken-3 rowable' : 'text-grey rowable'"
        >{{ text.initialText }}</pre
      >
    </v-col>
    <v-col :class="text.selectedText ? 'py-0 my-0 ps-0 col-auto mh-100' : 'd-none'" v-if="showData">
      <pre
        ref="dateRef"
        disabled
        :class="isDark ? 'text-grey-darken-3 rowable' : 'text-grey rowable'"
        >{{ text.selectedDates }}</pre
      >
    </v-col>
    <v-col
      :class="text.selectedText ? 'py-0 my-0 text-right col-auto rowable mh-0' : 'd-none'"
      v-if="showData"
    >
      <button
        type="button"
        v-for="file in filteredFiles"
        :key="file"
        class="v-btn--variant-plain d-block prebutton del ps-1"
        v-on:click="delFile(file)"
        :title="t('titles.del')"
      >
        <v-icon icon="mdi-close-box-outline" color="error"></v-icon>
      </button>
    </v-col>
  </v-row>
  <div class="d-block w-100 px-5 pt-0 pb-0 mt-0 mb-0">
    <small
      :class="
        isDark ? 'text-teal-darken-3 d-block float-right' : 'text-teal-darken-1 d-block float-right'
      "
    >
      <small class="d-block">
        {{ numFiltered }} {{ t('labels.files') }}
        <v-icon end size="x-small" class="ms-0" icon="mdi-file"></v-icon>
      </small>
    </small>
  </div>
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
  margin-left: 0em;
  margin-right: 0em;
  max-height: 30px !important;
  min-height: 0px !important;
  --v-icon-size-multiplier: 1 !important;
  font-size: 1.25rem !important;
}

.prebutton.more {
  margin-left: 0.2em;
}

.v-overlay-container .filetooltip .v-overlay__content {
  background-color: transparent !important;
  border: 0px !important;
}
.v-overlay-container .filetooltip .v-card--variant-flat {
  /*background-color: rgba(64,64,64, 0.75) !important; */
}

.prebutton.del {
  margin-right: 0.1em;
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

.sorticon {
  filter: opacity(50%);
}
.sorticon:last-child {
  position: absolute !important;
  right: 0px;
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
.fancyscroll .v-slide-group__container,
.fancyscroll .v-slide-group__container .v-slide-group__content {
  position: relative !important;
  display: block !important;
  max-width: 100% !important;
  width: 100% !important;
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
  border-top-color: rgba(var(--v-border-color), 0.2) !important;
}

.files-header {
  border-bottom: none !important;
  border-color: rgba(0, 172, 193, 0.1) !important;
  background-color: rgba(0, 172, 193, 0.1) !important;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-weight: 900 !important;
}

.files-header .sorter {
  display: inline-block;
  max-width: 90px !important;
  min-width: 90px !important;
  width: 90px !important;
  text-align: left;
}
.files-header .sorter:last-child {
  max-width: 120px !important;
  min-width: 120px !important;
  width: 120px !important;
}

::selection {
  color: rgb(var(--v-theme-on-background)) !important;
  background: rgba(var(--v-theme-warning), var(--v-disabled-opacity)) !important;
}
</style>

<script setup>
import { dialog, invoke, path } from '@tauri-apps/api'
import { readDir, renameFile } from '@tauri-apps/api/fs'
import { ref, computed, reactive, watch, toRaw, createHydrationRenderer } from 'vue'
import dayjs from 'dayjs'
import ButtonConfirm from './ButtonConfirm.vue'
import { useI18n } from 'vue-i18n'
import filenameReservedRegex, { windowsReservedNameRegex } from 'filename-reserved-regex'

import { listen } from '@tauri-apps/api/event'

listen('tauri://file-drop', async (event) => {
  if (event.payload) {
    let items = event.payload
    // console.debug('Items dropped:', items);
    console.debug('Number of items dropped:' + items.length)
    if (items.length > 0) {
      let dropped = true
      let droppedFiles = []
      let droppedFolders = []
      let fileList = []
      let numItems = 0
      for (let i = 0; i < items.length; i++) {
        await invoke('is_folder', { filePath: items[i] }).then(async (isFolder) => {
          rFiles.isReading = true
          if (isFolder) {
            numItems += 1
            droppedFolders.push(items[i])
            await readDir(items[i], { recursive: state.recursive }).then(async (files) => {
              if (state.recursive) {
                files = await getRecursiveList(files)
              }
              fileList.push(await files.map((item) => item.path.toString()))
              rFiles.isReading = false
            })
          } else {
            numItems += 1
            droppedFiles.push(items[i])
            rFiles.isReading = false
          }
        })
      }

      if (items.length === droppedFiles.length + droppedFolders.length && !rFiles.isReading) {
        //console.debug('droppedFiles ' + droppedFiles)
        //console.debug('droppedFolders '  +  droppedFolders)
        await clearAll()
        fileList.push(droppedFiles)

        if (fileList.length > 0) {
          fileList = fileList.flat()
          console.debug('Files dropped to read: ' + fileList.length)
          readFiles(fileList, dropped)
        }
      }
    }
  }
})

const { t } = useI18n()

const props = defineProps({
  isDark: Boolean
})

// Equivalent to tracked properties:
const state = reactive({
  selectedFiles: [],
  previousFiles: [],
  recursive: false,
  fileFilter: '',
  startNumberModal: false,
  startNumber: 1,
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

const sorting = reactive({
  name: false,
  extension: false,
  path: false,
  creation: false,
  modified: false,
  activeSort: ''
})

const errorSystem = reactive({
  alert: false,
  alertMsg: '',
  renameErrors: []
})
const rFiles = reactive({
  selectedFiles: [],
  previousFiles: [],
  isReading: false,
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

function sortBy(attribute) {
  resetChanges()
  const prevStatus = sorting[attribute]

  ;(sorting.name = false),
    (sorting.extension = false),
    (sorting.path = false),
    (sorting.creation = false),
    (sorting.modified = false),
    (sorting[attribute] = !prevStatus)
  sorting['activeSort'] = attribute
}

watch(sorting, () => {
  if (sorting.activeSort) {
    let list = state.selectedFiles
    let attribute = sorting.activeSort

    let mode = sorting[attribute] ? 'asc' : 'desc'
    console.debug('Sorting by ' + attribute + ' ' + mode + '...')

    switch (attribute) {
      case 'name':
      case 'extension':
        if (sorting[attribute]) {
          list = list.sort((a, b) => a[attribute].localeCompare(b[attribute]))
        } else {
          list = list.sort((a, b) => b[attribute].localeCompare(a[attribute]))
        }
        break
      case 'path':
        if (sorting[attribute]) {
          list = list.sort((a, b) => {
            let pathA = a.path + a.fullName
            let pathB = b.path + b.fullName
            return pathA.localeCompare(pathB)
          })
        } else {
          list = list.sort((a, b) => {
            let pathA = a.path + a.fullName
            let pathB = b.path + b.fullName
            return pathB.localeCompare(pathA)
          })
        }
        break
      case 'created':
      case 'modified':
        if (sorting[attribute]) {
          list = list.sort((a, b) => a[attribute] - b[attribute])
        } else {
          list = list.sort((a, b) => b[attribute] - a[attribute])
        }
        break
      default:
        console.debug('No valid attribute to sort by.')
    }
    state.selectedFiles = list
  } else {
    console.debug('Nothing to sort here')
  }
})

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
        text.initialText += list[i].path + list[i].fullName + '\n'
        text.selectedDates += niceDate(list[i].modified) + '\n'
      } else {
        text.initialText += list[i].path + list[i].fullName
        text.selectedDates += niceDate(list[i].modified)
      }
    }
    // text.selectedDates = list.map((item) => { niceDate(item.modified) }).join('\n')

    clearTimeout(rFiles.loadingTimeout)
    rFiles.loadingTimeout = setTimeout(() => {
      state.isUpdating = false
    }, 500)
  }
})

function onlyNumbers(evt) {
  evt = (evt) ? evt : window.event;
  let expect = evt.target.value.toString() + evt.key.toString();
  if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
    evt.preventDefault();
  } else {
    return true;
  }

}
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
      replaceText = state.replaceText //
    }

    if (state.elements.length > 0 || state.prefix || state.suffix || state.findText) {
      let numDigits = 0
      numDigits = list.length;
      if(!isNaN(state.startNumber)){
        numDigits = list.length + Number(state.startNumber);
      }
      numDigits = Math.floor(Math.log10(numDigits) + 1)

      let structure = ''
      if (state.elements.length > 0) {
        structure = '\\' + state.elements.join('\\')
      }

      let listNr = !isNaN(state.startNumber) ? Number(state.startNumber) || 0 : 1;
      list.forEach((item) => {
        listNr = String(Number(listNr));
        let finalExtension = item.newExtension
        let finalName = item.newName

        let date = dayjs(item.modified).format('YYYYMMDD').toString()
        let time = dayjs(item.modified).format('HHmmss').toString()
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

        finalName = finalName.replace(filenameReservedRegex(), '')
        finalName = finalName.replace(windowsReservedNameRegex(), '')
        textLines.push(finalName)

        listNr = String(Number(listNr) + 1 );
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

function setUpdating() {
  if (filteredFiles.value.length > 750) {
    state.isUpdating = true
  }
}

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
  setUpdating()
  const list = filteredFiles.value
  list.forEach((item) => {
    item.newName = item.name
    item.newExtension = item.extension
    item.newFullName = item.fullName
  })

  let newText = filterText(toRaw(list))
  resetChanges()
  textRef.value.innerText = newText
  text.selectedText = newText
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
  state.startNumber = 1
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
  /* state.isLoading = false 
  state.isUpdating = false */

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

function toggleNumberModal() {
  state.startNumberModal = !state.startNumberModal;
}

function toggleToLower() {
  let textLines = textRef.value.innerText.trim().split(/\n/)
  let lowercased = []
  let i = 0
  while (i < textLines.length) {
    let fullName = textLines[i]
    let newExtension = fullName.split('.').pop().toString()
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
    let newExtension = fullName.split('.').pop().toString()
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
  clearTimeout(rFiles.loadingTimeout)
  state.stopLoading = true
  state.isLoading = false
}
function cancelRename() {
  state.stopRenaming = true
}

function toggleRecursive() {
  state.recursive = !state.recursive
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
      let newExtension = newFullName.split('.').pop().toString()
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
  errorSystem.renameErrors = []
  errorSystem.alertMsg = ''
  errorSystem.alert = false

  dialog.open({ directory: true }).then(async (directory) => {
    console.debug(directory)
    if ((await directory) != null && directory) {
      state.isLoading = true
      state.stopLoading = false
      let dropped = false
      readFolder(directory, dropped)
    } else {
      state.isLoading = false
      state.stopLoading = true
    }
  })
}

function getRecursiveList(objects) {
  let flatArray = []
  if (!state.cancelLoad) {
    // Recursive function to handle the flattening
    function flatten(array) {
      array.forEach((item) => {
        const { children, ...rest } = item
        flatArray.push(rest) // Push the current item without the children
        if (children && children.length) {
          flatten(children) // Recursively flatten the children
        }
      })
    }
    flatten(objects) // Kick off the recursion with the initial array
  }
  return flatArray
}

async function readFolder(directory = '', dropped = false) {
  state.isLoading = true
  rFiles.isReading = true

  return await readDir(directory, { recursive: state.recursive })
    .then(async (files) => {
      if (state.recursive) {
        // console.debug('Getting recursive...');
        files = await getRecursiveList(files)
        // console.debug('Got all recursive...')
      }

      rFiles.isReading = false

      files = await files.filter(
        (item) =>
          !item.name.startsWith('.') &&
          !item.name.startsWith('Thumbs.db') &&
          !item.name.startsWith('desktop.ini')
      )
      // console.debug('Excluding system files...');

      if (files.length > 0 && !state.stopLoading) {
        let prevText = ''
        if (filteredFiles.value.length > 0) {
          rFiles.previousFiles = toRaw(filteredFiles.value)
          if (textRef.value) {
            prevText = toRaw(textRef.value.innerText)
          }
        }
        if (!dropped) {
          await clearAll()
        }
        let totalLenght = files.length
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
            state.isLoading = true
            let pathInfo = await invoke('get_path_info', { filePath: file.path })
            if (!pathInfo.is_folder) {
              let created = pathInfo.created.secs_since_epoch * 1000
              let modified = pathInfo.modified.secs_since_epoch * 1000
              let fullfilename = file.name
              let filepath = file.path.replace(fullfilename, '')
              let extension = ''
              if (fullfilename.includes('.')) {
                extension = fullfilename.split('.').pop().toString()
              }
              let filename = fullfilename.replace('.' + extension, '')
              let newId = 'file' + pathInfo.uniqueid + new Date().getTime()

              let newFile = {
                id: newId,
                name: filename,
                extension: extension,
                fullName: fullfilename,
                path: filepath,
                created: created,
                modified: modified,
                newName: filename,
                newExtension: extension,
                newFullName: fullfilename,
                saved: false
              }
              // console.debug('Added file...');
              await state.selectedFiles.push(newFile)

              filecounter += 1
            } else {
              folders += 1
              // console.debug(pathInfo);
            }
            if (filecounter == totalLenght - folders) {
              rFiles.loadingTimeout = setTimeout(() => {
                console.debug('Stopped loading on folder read because finished.')
                progress.value = 0
                state.isLoading = false
              }, 1000)
            } else {
              progress.value = Math.ceil((filecounter * 100) / (totalLenght - folders))
            }
          }
        }
      } else {
        rFiles.loadingTimeout = setTimeout(() => {
          state.isLoading = false
          console.debug('Stopped loading on folders because no files')
        }, 1000)
      }
    })
    .catch((error) => {
      console.debug(error)
      errorSystem.renameErrors.push(error)
      errorSystem.alertMsg = error
      errorSystem.alert = true
      state.isLoading = false
    })
}

function selectFiles() {
  errorSystem.renameErrors = []
  errorSystem.alertMsg = ''
  errorSystem.alert = false

  dialog
    .open({
      directory: false,
      multiple: true,
      title: 'Select files to rename' /*, filters: filter */
    })
    .then(async (files) => {
      if (files != null) {
        // console.debug(files);
        let dropped = false
        state.stopLoading = false
        readFiles(files, dropped)
      } else {
        state.isLoading = false
        state.stopLoading = true
      }
    })
}

async function readFiles(files, dropped = false) {
  state.isLoading = true
  // console.debug('Initial files: ', files);
  files = await files.filter((item) => {
    let filedata = item.split('\\')
    let fullfilename = filedata.pop().toString()
    if (
      !fullfilename.startsWith('.') &&
      !fullfilename.startsWith('Thumbs.db') &&
      !fullfilename.startsWith('desktop.ini')
    ) {
      return item
    }
  })
  if (files) {
    if (files.length > 0 && !state.stopLoading) {
      let prevText = ''
      if (filteredFiles.value.length > 0) {
        rFiles.previousFiles = toRaw(filteredFiles.value)
        if (textRef.value) {
          prevText = toRaw(textRef.value.innerText)
        }
      }
      if (!dropped) {
        await clearAll()
      }
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
          state.isLoading = true
          let pathInfo = await invoke('get_path_info', { filePath: file })
          if (!pathInfo.is_folder) {
            let created = pathInfo.created.secs_since_epoch * 1000
            let modified = pathInfo.modified.secs_since_epoch * 1000
            let filedata = file.split('\\')
            let fullfilename = filedata.pop().toString()
            let filepath = file.replace(fullfilename, '')
            let extension = ''
            if (fullfilename.includes('.')) {
              extension = fullfilename.split('.').pop().toString()
            }
            let filename = fullfilename.replace('.' + extension, '')
            let newId = 'file' + pathInfo.uniqueid + new Date().getTime()

            let newFile = {
              id: newId,
              name: filename,
              extension: extension,
              fullName: fullfilename,
              path: filepath,
              created: created,
              modified: modified,
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
            rFiles.loadingTimeout = setTimeout(() => {
              if (!rFiles.isReading) {
                progress.value = 0
                state.isLoading = false
                console.debug('Stopped loading on files because finished.')
              }
            }, 1000)
          } else {
            progress.value = Math.ceil((filecounter * 100) / (totalLenght - folders))
          }
        }
      }
    } else {
      rFiles.loadingTimeout = setTimeout(() => {
        if (!rFiles.isReading) {
          state.isLoading = false
          console.debug('Stopped loading on files because no files.')
        }
      }, 1000)
    }
  }
}

async function saveFiles() {
  // We need to save the status of each file: if it has been saved or not, and update it after saving it.

  let updated = false
  errorSystem.renameErrors = []
  errorSystem.alertMsg = ''
  errorSystem.alert = false

  var selected = toRaw(filteredFiles.value)
  var modified = textRef.value.innerText.trim().split(/\n/)
  for (var i = 0; i < Number(selected.length); i++) {
    let fullPath = selected[i].path + modified[i]
    modified[i] = fullPath
  }

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
      /* state.selectedFiles = [] */
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
          let newPath = modified[i]
          let newFullName = newPath.replace(selected[i].path, '')
          let newExtension = newFullName.split('.').pop().toString()
          let newName = newFullName.replace('.' + newExtension, '')
          let initialPath = selected[i].path + selected[i].fullName
          // let newPath = selected[i].path + modified[i]
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
        extension = modified.split('.').pop().toString()
        name = modified.split('.')[0].toString()
      }
      selectedFiles[i].newFullName = name + '.' + extension
      selectedFiles[i].newName = name
      selectedFiles[i].newExtension = extension
      selectedFiles[i].saved = false
    }

    i = i + 1
  } while (i < selectedFiles.length)

  state.selectedFiles = toRaw(await selectedFiles.filter((file) => file.id != removed.id))
}
</script>
