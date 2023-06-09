<script setup> 
  import { dialog, invoke } from "@tauri-apps/api";
  import { readDir, renameFile } from '@tauri-apps/api/fs';
  import { useDate } from 'vuetify/labs/date'
  import { ref, computed, reactive, onMounted, onUpdated  } from 'vue'

  let id = 0

  // Equivalent to tracked properties:
  
  const state = reactive({selectedText: '', selectedFiles: []});
  const editedText = ref('');
  
  // Equivalent to Ember computed / tracked+getters:

  const filteredFiles = computed(() => {
    if(state.selectedFiles.length > 0){
      return state.selectedFiles;
    }
    return '';
  })

  const nrFiles = computed(() => {
    if(filteredFiles.length > 0){
      return filteredFiles.length;
    }
    return 1;
  })
  
  const finalText = computed(() => {
    return state.selectedText;
  })  
  
  const filesText = computed(() => {
    let result = '';    
    if(state.selectedFiles.length > 0){
      state.selectedFiles.forEach((file)=>{
        if(file.extension){
          result += file.name+'.'+file.extension+' \n';
        } else {
          result += file.name+' \n';
        }
      });        
    }
    return result.toString();
  })
  
  // Equivalent to afterModel:  
  onMounted (() => {
    editedText.value = filesText;
  })   
 
  onUpdated (() => {
    // selectedText.value.textContent = filesText;
    console.log(editedText.value)
  })   

  // Equivalent to Ember actions:

  
  function openFolder() {
    let filter = [{name: "Mp4 video file", extensions: ['mp4']}]; 
    dialog.open({ directory: false, multiple: true, title: 'Select files to rename'/*, filters: filter */ }).then((files) => {
      // console.debug(files);
      if(files){
        if(files.length > 0){
          state.selectedFiles = [];
          files.forEach(async(file)=>{
            let modified = await invoke('modified_time',{filePath: file});
            modified = modified.secs_since_epoch * 1000;
            let filedata = file.split('\\');
            let fullfilename = filedata.pop().toString(); 
            let filepath = file.replace(fullfilename,'');
            let extension = '';
            if(file.includes('.')){
              extension = fullfilename.split('.').slice(-1).toString();
            }
            let filename = fullfilename.replace('.'+extension, '');
            
            //if(filename && extension.toLowerCase() === 'mp4'){
            let newFile = { name: filename, extension: extension, path: filepath, date: modified };
            // console.debug(newFile);
            state.selectedFiles.push(newFile);
            //}
          });
          state.selectedText = filesText;
        }
      }
    });
  }
  
  function delFile(removed){
    console.log(removed.name);
    state.selectedFiles = state.selectedFiles.filter((file) => file !== removed)
  }

</script>

<template>
  <article>
    <v-btn append-icon="mdi-file" @click="openFolder">
      Select files
    </v-btn>
    <v-row no-gutters>
      <v-col class="pt-3 my-0">
        <strong>Date</strong>
        <hr>
      </v-col>
      <v-col class="pt-3 my-0">
        <strong class="px-3">File name</strong>
        <hr>
      </v-col>
    </v-row>  
    <v-row no-gutters>
      <v-col class="py-0 my-0" cols="4">
        <v-row no-gutters v-for="file in filteredFiles">
          <v-col class="py-0 my-0">
            <pre>{{file.date}}</pre>
          </v-col>
          <v-col class="py-0 my-0">
            <pre contenteditable :key="file.name">{{file.name}}</pre>
          </v-col>          
        </v-row>
      </v-col>
      <v-col class="py-0 my-0">
        <pre class="px-3" :key="state.selectedText" contenteditable>{{editedText.value}}</pre>
      </v-col>
      <v-col class="py-0 my-0" cols="1">
        <v-row no-gutters v-for="file in filteredFiles">
          <v-col class="py-0 my-0 text-end">
            <pre class="prebuttons"><v-btn v-on:click="delFile(file)" density="compact" icon="mdi-delete-outline"></v-btn></pre>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <p>Final file names:</p>
    <v-row>
      <v-col>
        <v-textarea auto-grow :key="state.selectedText" :model-value="state.selectedText"></v-textarea>
      </v-col>
    </v-row>
  </article>
</template>

<style>
  article { width: 100%; min-width: 100%; }
  pre { line-height: 2em; padding: 0px; margin: 0px; }
  [contenteditable] { outline: 0px solid transparent; border-color: black!important; border-width: 0px!important; }
  .prebuttons { max-height: 2em!important; }
</style>