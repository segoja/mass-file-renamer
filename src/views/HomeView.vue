<template>
  <article>
    <v-btn append-icon="mdi-file" @click="openFolder">
      Open folder
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
      <v-col class="py-0 my-0">
        <v-row no-gutters v-for="file in this.filteredFiles">
          <v-col class="py-0 my-0">
            <pre>{{file.date}}</pre>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="py-0 my-0">
        <pre contenteditable class="px-3">{{filesText}}</pre>
      </v-col>
    </v-row>   
    
  </article>
</template>

<script setup>
  import { VDataTable } from 'vuetify/labs/VDataTable'
</script>

<script> 
import { dialog, invoke } from "@tauri-apps/api";
import { readDir, renameFile } from '@tauri-apps/api/fs';
import { useDate } from 'vuetify/labs/date'

  export default {
    // The equivalent of model
    data() {
      return {
        selectedFiles:  [],
        autogrow: false,
        selectedText: '',
        headers: [
          {
            title: 'Name',
            align: 'start',
            sortable: true,
            key: 'name',
            align: ' d-none'
          },
          {
            title: 'Extension',
            align: 'start',
            sortable: true,
            key: 'extension',
            align: ' d-none'
          },
          {
            title: 'Path',
            align: 'start',
            sortable: true,
            key: 'path',
            align: ' d-none'
          },
          {
            title: 'Date',
            align: 'start',
            sortable: true,
            key: 'date',
          },
        ],
      }
    },
    
    // The equivalent to ember actions
    methods: {
      openFolder() {
        let filter = [{name: "Mp4 video file", extensions: ['mp4']}]; 
        dialog.open({ directory: false, multiple: true, title: 'Select files to rename'/*, filters: filter */ }).then((files) => {
          // console.debug(files);
          if(files){
            if(files.length > 0){
              this.selectedFiles = [];
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
                this.selectedFiles.push(newFile);
                //}
              });
              this.selectedText = '';
              if(this.selectedFiles.length > 0){
                this.selectedFiles.forEach((file)=>{
                  if(file.extension){
                     this.selectedText += file.name+'.'+file.extension+'\n';
                  } else {
                     this.selectedText += file.name+'\n';
                  }
                });
              }
            }
          }
        });
      },
      getText(content){
        console.log(content);
        // return content;
      }
    },
    
    // The equivalent to ember afterModel;
    mounted(){
      this.selectedFiles = [];
    },
    // Computed properties/getters like in ember
    computed: {
      filteredFiles() {
        if(this.selectedFiles.length > 0){
          return this.selectedFiles;
        }
        return '';
      },
      nrFiles() {
        if(this.filteredFiles.length > 0){
          return this.filteredFiles.length;
        }
        return 1;
      },      
      filesText() {
        let result = '';
        if(this.filteredFiles.length > 0){
          this.filteredFiles.forEach((file)=>{
            if(file.extension){
              result += file.name+'.'+file.extension+'\n';
            } else {
              result += file.name+'\n';
            }
          });
        }
        return result;
      }
    }
  }
</script>
<style>
  article { width: 100%; min-width: 100%; }
  pre { line-height: 1.75em; padding: 0px; margin: 0px; }
  [contenteditable] { outline: 0px solid transparent; border-color: black!important; border-width: 0px!important; }
</style>