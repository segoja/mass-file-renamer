// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::fs;
use std::path::Path;
use std::time::SystemTime;

#[derive(Debug, Serialize)]
struct ListInfo {
    path: String,
    name: String,
    extension: Option<String>,
}


#[tauri::command]
fn rename_file(initial: &str, newname: &str) -> Result<(), String> {
    // Check if the origin file exists
    let origin_path = Path::new(initial);
    if !origin_path.exists() {
        return Err(format!("Origin file does not exist: {}", initial));
    }

    // Check if the destination file already exists
    let destination_path = Path::new(newname);
    if destination_path.exists() {
        return Err(format!("Destination path already exists: {}", newname));
    }

    // Perform the rename operation
    match fs::rename(origin_path, destination_path) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Failed to rename file: {}", err)),
    }
}

#[tauri::command]
fn read_folder(folder_path: String, recursive: bool) -> Result<Vec<ListInfo>, String> {
    let mut file_data = Vec::new();
    let folder_path = Path::new(&folder_path);

    if !folder_path.is_dir() {
        return Err(format!("{} is not a valid directory", folder_path.display()));
    }

    let entries = match fs::read_dir(folder_path) {
        Ok(entries) => entries,
        Err(err) => return Err(format!("Failed to read directory: {}", err)),
    };

    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(err) => return Err(format!("Failed to read entry: {}", err)),
        };

        let path = entry.path();

        if path.is_file() {
            let absolute_path = match path.canonicalize() {
                Ok(abs_path) => match abs_path.to_str() {
                    Some(path_str) => {
                        // Normalize the path by removing the extended-length prefix if present
                        if path_str.starts_with("\\\\?\\") {
                            // Remove the extended-length prefix
                            path_str[4..].to_string() // Remove the `\\?\\` prefix
                        } else {
                            path_str.to_string()
                        }
                    }
                    None => return Err("Failed to convert path to string".to_string()),
                },
                Err(err) => return Err(format!("Failed to get absolute path: {}", err)),
            };
            
            let name = path
                .file_name()
                .and_then(|f| f.to_str())
                .unwrap_or("")
                .to_string();
            let extension = path
                .extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| ext.to_string());

            file_data.push(ListInfo {
                path: absolute_path,
                name,
                extension,
            });
        } else if recursive && path.is_dir() {
            let nested_files = read_folder(path.to_str().unwrap_or("").to_string(), true)?;
            file_data.extend(nested_files);
        }
    }

    Ok(file_data)
}


fn generate_file_hash<P: AsRef<Path>>(path: P) -> String {
    if let Ok(metadata) = fs::metadata(&path) {
        // Get the last modified time as a UNIX timestamp
        let modified_time = metadata
            .modified()
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
    uniqueid: String,
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
        uniqueid: id,
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
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            rename_file,
            read_folder,
            modified_time,
            get_path_info,
            is_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
