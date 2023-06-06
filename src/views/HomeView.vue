<template>
  <article>
    <v-file-input 
      label="Select files to rename..." 
      variant="outlined"
      multiple
      prepend-icon="mdi-file"
      clearable
      @update:modelValue="(files) => this.selectedFiles = files"
    ></v-file-input>
    
    <ul v-if="this.selectedFiles">
      <li v-for="file in this.selectedFiles">
        <span>{{ file.name }}</span>
      </li>
    </ul>
    <v-list v-if="this.selectedFiles">
      <v-list-item 
        v-for="file in this.selectedFiles"
        :key="file.name"
        :title="file.name"
      >
      </v-list-item>
    </v-list>
  </article>
</template>


<script> 
import { dialog, invoke } from "@tauri-apps/api";
import { readDir, renameFile } from '@tauri-apps/api/fs';
 
  export default {
    // The equivalent of model
    data() {
      return {
        selectedFiles:  {},
      }
    },
    
    // The equivalent to ember actions
    methods: {
      increment() {
        // update component state
      }
    },
    
    // The equivalent to ember afterModel;
    mounted(){
      this.selectedFiles = {};
    },
    // Computed properties/getters like in ember
    computed: {
      filteredFiles() {
        console.log(this.selectedFiles);
        if(this.selectedFiles.length > 0){
          return this.selectedFiles;
        }
        return '';
      }
    }
  }
</script>