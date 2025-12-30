use std::fs;
use tauri::Manager;

mod security;
mod auth;
mod commands;

use security::{encrypt_data, decrypt_data, hide_file};

#[derive(serde::Serialize, serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    username: String,
    avatar_id: String,
    client_id: String,
    client_secret: String,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_config(app: tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    }

    // Use a dotfile to encourage hiding on Unix, and .dat to obscure content type
    let config_path = config_dir.join(".secrets.dat");
    
    let json = serde_json::to_string(&config).map_err(|e| e.to_string())?;
    let encrypted = encrypt_data(&json)?;

    fs::write(&config_path, encrypted).map_err(|e| e.to_string())?;
    
    // Apply hidden attribute
    hide_file(&config_path);

    Ok(())
}

#[tauri::command]
fn load_config(app: tauri::AppHandle) -> Result<Option<AppConfig>, String> {
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    let config_path = config_dir.join(".secrets.dat");

    if !config_path.exists() {
        return Ok(None);
    }

    let encrypted_content = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let json = decrypt_data(&encrypted_content.trim())?;
    
    let config: AppConfig = serde_json::from_str(&json).map_err(|e| e.to_string())?;

    Ok(Some(config))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            save_config, 
            load_config,
            commands::login_onedrive,
            commands::list_minecraft_worlds // Register new command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
