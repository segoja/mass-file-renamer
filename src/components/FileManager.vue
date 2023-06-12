<template>
    <v-row>
      <v-col>
        <v-btn append-icon="mdi-file" @click="openFolder">
          Select files
        </v-btn>
        <v-btn append-icon="mdi-content-save" @click="saveFiles" class="float-right" :disabled="isDisabled">
          Apply
        </v-btn>
      </v-col>
    </v-row>    
    <v-row no-gutters>
      <v-col class="pt-3 my-0" cols="3">
        <strong>Date</strong>
        <hr>
      </v-col>
      <v-col class="pt-3 my-0">
        <strong class="px-3">File name</strong>
        <hr>
      </v-col>
    </v-row>  
    <v-row no-gutters>
      <v-col class="py-0 my-0" cols="3">
        <v-row no-gutters v-for="file in state.selectedFiles">
          <v-col class="py-0 my-0">
            <pre>{{niceDate(file.date)}}</pre>
          </v-col> 
          <!-- <v-col class="py-0 my-0">
            <pre contenteditable @paste="massPaste" @drag="massCopy" class="selectable">{{file.name}}</pre>
          </v-col> -->           
        </v-row>
      </v-col>
      <v-col class="py-0 my-0">
        <pre class="px-3" ref="textRef" @keydown="backupText"  @keyup="getText" contenteditable >{{text.selectedText}}</pre>
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
  pre.selectable{ pointer-events: stroke; }
</style>

<script setup> 
  import { dialog, invoke } from '@tauri-apps/api';
  import { readDir, renameFile } from '@tauri-apps/api/fs';
  import { useDate } from 'vuetify/labs/date'
  import { ref, computed, reactive, onMounted, onUpdated, watch, isProxy, toRaw  } from 'vue'
  import dayjs from 'dayjs'

  // Equivalent to tracked properties:
  
  const state = reactive({selectedFiles: [], renameErrors: []});
  const text = reactive({selectedText: '', prevText: '', lastCursor: '', isKeydown: false });
  
  const textRef = ref('');
  
  watch(state, (newValue, oldValue) => {
    let list = toRaw(state.selectedFiles);
    // console.log(list.length);
    let newText = '';
    if(list.length > 0){
      let textLines = list.map(item => item.fullname);
      newText = textLines.join('\n');    
    }
    text.selectedText = newText;
    text.prevText = newText;
  });  

  watch(text, (newValue, oldValue) => {

  }); 
  onUpdated(() => {
    // text content should be the same as current `count.value`
    console.log('Content got updated')
  })
  // Equivalent to Ember computed / tracked+getters:

  const filteredFiles = computed(() => {
    if(state.selectedFiles.length > 0){
      return state.selectedFiles;
    }
    return '';
  })

  const isDisabled = computed(() => {
    if(state.selectedFiles.length > 0){
      return false;
    }
    return true;
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
  
  // Keydown checks:
  function backupText(event){
    if(!text.isKeydown){
      // console.log(event);
      let textLines = textRef.value.innerText.trim().split(/\n/).length;
            
      let prevLines = text.prevText.split(/\n/).length;
      
      let selection = document.getSelection();
      text.lastCursor = selection.anchorOffset;
      
      if(prevLines == textLines){
        text.prevText = textRef.value.innerText;
      }
      text.isKeydown = true;
    }
  }
  
  // keyup checks:
  function getText() {
    text.isKeydown = false;
    // text.selectedText = textRef.value.innerText.trim().split(/\r?\n/)
    let backupLines = text.prevText.split(/\n/).length;
    let textLines = textRef.value.innerText.trim().split(/\n/);
    let selected = toRaw(state.selectedFiles);
    
    let i = 0;
    let restore = false;
        
    if(textLines.length < backupLines){
      //console.log('You deleted the wrong thing!');
      textRef.value.textContent = text.prevText;
      
      let selectedText = window.getSelection();
      let selectedRange = document.createRange();
      selectedRange.setStart(textRef.value.childNodes[0], text.lastCursor);
      selectedRange.collapse(true);
      selectedText.removeAllRanges();
      selectedText.addRange(selectedRange);
      textRef.value.focus();       
    } else {
      do {
        if(!textLines[i]){
          restore = true;
          if(selected.extension){
            textLines[i] = selected[i].name+'.'+selected[i].extension;
          } else {
            textLines[i] = selected[i].name;
          }
        }
        i = i + 1;
      } while (i < selected.length);
      
      if(restore){
        text.selectedText = textLines.join('\n');
      }      
      text.prevText = text.selectedText;
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
            let newId = 'file'+filecounter;
            //if(filename && extension.toLowerCase() === 'mp4'){
            let newFile = { id: newId, name: filename, extension: extension, path: filepath, date: modified, fullname: fullfilename, saved: false };
            // console.debug(newFile);
            state.selectedFiles.push(newFile);
            //}
            filecounter += 1;
          });
          state.selectedFiles = await filesList;          
          state.modifiedFiles = await filesList;
        }
      }
    });
  }
  
  function saveFiles(){

    // We need to save the status of each file: if it has been saved or not, and update it after saving it.

    let updated = false;
    state.renameErrors = [];
    
    var selected = toRaw(state.selectedFiles);
    var modified = textRef.value.innerText.trim().split(/\n/);
    
    let targetLength = Number(selected.length);
    console.log('Selected: ', targetLength);
    console.log('Input text: ', modified.length);
    // console.log('Selected: ', selected);
    // console.log('Input text: ', modified);
    
    if(targetLength == modified.length){
      let i = 0;
      state.selectedFiles = [];
      do {
        //if(selected[i].id == 'file'+i){
          let newFullName = modified[i];
          let newExtension = newFullName.split('.').slice(-1).toString();
          let newName = newFullName.replace('.'+newExtension, '');
          // if(selected[i].fullname != modified[i]){
            let initialPath = selected[i].path+selected[i].fullname;
            let newPath = selected[i].path+modified[i];
            let updating = selected[i];
            
            updating.fullname = newFullName;
            updating.name = newName;
            updating.extension = newExtension;
            updating.saved = false;
            
            console.log('Initial: ', initialPath);
            console.log('Newpath: ', newPath);
            updated = true;
                        
            renameFile(initialPath, newPath).then(
              (success)=>{
                updating.saved = true;
                state.selectedFiles.push(updating)
                console.log('File renamed successfully');
              },
              (error) => { 
                updating.saved = false;
                state.selectedFiles.push(updating)
                state.renameErrors.push(error); 
                console.log(error);
              }
            )
          //} else {
          //  console.log('New name: '+modified[i]);
          //  console.log('Old name: '+selected[i].fullname);
          //}
        //} else {
          //console.log('No changes for file'+i);
        //}
        i++
      } while (i < targetLength);
    }
    
    if(state.renameErrors.length > 0){
      console.log(state.renameErrors);
    } else {
      if(updated){
        console.log('Updating files array');
        // state.selectedFiles = selected;
      }
    }
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
    
    let selectedFiles = toRaw(state.selectedFiles);
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
        selectedFiles[i].saved = false;
        selectedFiles[i].name = name;
        selectedFiles[i].extension = extension;
        selectedFiles[i].fullname = name+'.'+extension;
      }
      
      i = i + 1;
    } while (i < selectedFiles.length);

    state.selectedFiles = toRaw(selectedFiles.filter(file => file.id != removed.id));
  }
  
</script>