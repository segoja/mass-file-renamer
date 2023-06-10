<template>
    <v-btn append-icon="mdi-file" @click="openFolder">
      Select files
    </v-btn>
    <v-row no-gutters>
      <v-col class="pt-3 my-0" cols="4">
        <strong>Date</strong>
        <hr>
      </v-col>
      <v-col class="pt-3 my-0">
        <strong class="px-3">File name</strong>
        <hr>
      </v-col>
    </v-row>  
    <v-row no-gutters>
      <v-col class="py-0 my-0" cols="2">
        <v-row no-gutters v-for="file in state.selectedFiles">
          <v-col class="py-0 my-0">
            <pre>{{niceDate(file.date)}}</pre>
          </v-col>            
        </v-row>
      </v-col>
      <v-col class="py-0 my-0">
        <pre class="px-3" ref="textRef" @keyup="getText" contenteditable >{{text.selectedText}}</pre>
      </v-col>
      <v-col class="py-0 my-0" cols="1">
        <v-row no-gutters v-for="file in state.selectedFiles">
          <v-col class="py-0 my-0 text-end">
            <pre class="prebuttons"><v-btn v-on:click="delFile(file)" density="compact" icon="mdi-delete-outline"></v-btn></pre>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>

<style>
  article { width: 100%; min-width: 100%; }
  pre { line-height: 2em; padding: 0px; margin: 0px; }
  [contenteditable] { outline: 0px solid transparent; border-color: black!important; border-width: 0px!important; }
  .prebuttons { max-height: 2em!important; }
  pre.selectable{ pointer-events: revert-layer; }
</style>

<script setup> 
  import { dialog, invoke } from '@tauri-apps/api';
  import { readDir, renameFile } from '@tauri-apps/api/fs';
  import { useDate } from 'vuetify/labs/date'
  import { ref, computed, reactive, onMounted, onUpdated, watch, isProxy, toRaw  } from 'vue'
  import dayjs from 'dayjs'

  // Equivalent to tracked properties:
  
  const state = reactive({selectedFiles: [], modifiedFiles: []});
  const text = reactive({selectedText: ''});
  
  const textRef = ref('');
  
  watch(state, (newValue, oldValue) => {
    let list = toRaw(state.selectedFiles);
    // console.log(list.length);
    let newText = '';
    if(list.length > 0){
      list.forEach((file)=>{
        if(file.extension){
          newText += file.name+'.'+file.extension+'\n';
        } else {
          newText += file.name+'\n';
        }
      });        
    }
    text.selectedText = newText;
  });  

  watch(text, (newValue, oldValue) => {

  }); 
  onUpdated(() => {
    // text content should be the same as current `count.value`
    console.log(document.getElementById('count').textContent)
  })
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

  // Equivalent to Ember actions:

  function niceDate(date) {
    if(date){
      return dayjs(date).format('YYYY/MM/DD, HH:mm:ss');
    } else {
      return 'No date';
    }
  }

  function getText() {
    // text.selectedText = textRef.value.innerText.trim().split(/\r?\n/)
    let textLines = textRef.value.innerText.trim().split(/\r?\n/);
    let i = 0;
    let restore = false;
    let selectedLines = state.selectedFiles.length;
    if(textLines < selectedLines){
      alert('WTF BRO!');
    }
    do {
      if(!textLines[i]){
        restore = true;
        if(state.selectedFiles[i].extension){
          textLines[i] = state.selectedFiles[i].name+'.'+state.selectedFiles[i].extension;
        } else {
          textLines[i] = state.selectedFiles[i].name;
        }
      }
      i = i + 1;
    } while (i < state.selectedFiles.length);
    
    if(restore){
      text.selectedText = textLines.join('\n');
    }
  }
  
  function openFolder() {
    let filter = [{name: "Mp4 video file", extensions: ['mp4']}]; 
    dialog.open({ directory: false, multiple: true, title: 'Select files to rename'/*, filters: filter */ }).then(async(files) => {
      // console.debug(files);
      if(files){
        if(files.length > 0){
          let filesList = [];
          // console.log(files);
          let filecounter = 0; 
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
            let newFile = { id: 'file'+filecounter, name: filename, extension: extension, path: filepath, date: modified, fullname: fullfilename };
            // console.debug(newFile);
            state.selectedFiles.push(await newFile);
            //}
            filecounter += 1;
          });
          state.selectedFiles = await filesList;          
          state.modifiedFiles = await filesList;
        }
      }
    });
  }
  
  function delFile(removed){
    let prevText = textRef.value.innerText.trim()    
    prevText = prevText.split(/\r?\n/);
    let updatedText = '';
    let removedText = '';
    if(removed.extension){
      removedText = removed.name+'.'+removed.extension+'\n';
    } else {
      removedText = removed.name+'\n';
    }
    
    let selectedFiles = state.selectedFiles
    let i = 0;
    do {
      let current = selectedFiles[i];
      let selFileText = '';
      if(current.extension){
        selFileText = current.name+'.'+current.extension+'\n';
      } else {
        selFileText = current.name+'\n';
      }
      
      let modified = prevText[i];
      if(modified != selFileText && modified){
        let extension = '';
        let name = modified ? modified : 'unnamed('+i+')';
        if(modified.includes('.')){
          extension = modified.split('.').slice(-1).toString();
          name = modified.split('.')[0].toString();
        }
        selectedFiles[i].name = name;
        selectedFiles[i].extension = extension;
        selectedFiles[i].fullname = name+'.'+extension;
      }
      
      i = i + 1;
    } while (i < selectedFiles.length);

    state.selectedFiles = selectedFiles.filter((file) => file.id !== removed.id)
  }
  
</script>