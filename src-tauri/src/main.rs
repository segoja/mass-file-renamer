// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::SystemTime; 
use std::path::{Path};
use std::fs; 
use serde::Serialize;
use sha2::{Sha256, Digest};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};

fn generate_file_hash<P: AsRef<Path>>(path: P) -> String {
  if let Ok(metadata) = fs::metadata(&path) {
      // Get the last modified time as a UNIX timestamp
      let modified_time = metadata.modified()
          .unwrap_or_else(|_| SystemTime::UNIX_EPOCH)
          .duration_since(SystemTime::UNIX_EPOCH)
          .map_or(0, |duration| duration.as_millis());

      // Create a string with the path and the modified timestamp
      let path_str = path.as_ref().to_string_lossy();
      let data = format!("{}{}", path_str, modified_time);

      // Hash the string
      let mut hasher = Sha256::new();
      hasher.update(data.as_bytes());
      let result = hasher.finalize();

      // Convert the hash to a hex string
      format!("{:x}", result)
  } else {
      // Return empty string if metadata retrieval fails
      let rng = thread_rng();
      let random_string: String = rng
          .sample_iter(&Alphanumeric)
          .take(16)
          .map(char::from)
          .collect();
      let mut hasher = Sha256::new();
      hasher.update(random_string.as_bytes());
      let result = hasher.finalize();

      format!("{:x}", result)
  }
}


#[derive(Debug, Serialize)]
struct FileInfo {
    is_folder: bool,
    created: Option<SystemTime>,
    modified: Option<SystemTime>,
    uniqueid: String
}



#[tauri::command]
fn get_path_info(file_path: String) -> FileInfo {
    let path = Path::new(&file_path);
    
    let meta = fs::metadata(file_path.clone()).ok();
    let created = meta.clone().expect("REASON").created().ok();
    let modified = meta.clone().expect("REASON").modified().ok();
    let id = generate_file_hash(&file_path);

    FileInfo {
      is_folder: path.is_dir(),
      created: created,
      modified: modified,
      uniqueid: id
    }
}

#[tauri::command]
fn is_folder(file_path: String) -> bool {
    let path = Path::new(&file_path);    
    path.is_dir()
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
    .invoke_handler(tauri::generate_handler![modified_time,get_path_info,is_folder])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}