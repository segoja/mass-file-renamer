// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::SystemTime; 
use std::path::{Path};
use std::fs;
use serde::Serialize;

#[derive(Debug, Serialize)]
struct FileInfo {
    is_folder: bool,
    created: Option<SystemTime>,
    modified: Option<SystemTime>
}



#[tauri::command]
fn get_path_info(file_path: String) -> FileInfo {
    let path = Path::new(&file_path);
    
    let meta = fs::metadata(file_path.clone()).ok();
    let created = meta.clone().expect("REASON").created().ok();
    let modified = meta.clone().expect("REASON").modified().ok();
    
    FileInfo {
      is_folder: path.is_dir(),
      created: created,
      modified: modified
    }
}

#[tauri::command]
fn modified_time(file_path: String) -> Result<SystemTime, String> {
    modified_time_of(file_path).map_err(|err| err.to_string())
}

fn modified_time_of(file_path: String) -> Result<SystemTime, std::io::Error> {
  let meta = fs::metadata(file_path)?;
  meta.modified()
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![modified_time,get_path_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}