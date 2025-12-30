use tauri::Manager;
use crate::auth::OneDriveAuth;
use crate::AppConfig;
use crate::security::decrypt_data;
use std::fs;
use std::path::PathBuf;

#[derive(serde::Serialize, Debug)]
pub struct LocalWorld {
    pub name: String,
    pub path: String,
    // Future: Add icon_path or last_played from level.dat
}

#[tauri::command]
pub async fn login_onedrive(app: tauri::AppHandle) -> Result<String, String> {
    // 1. Load Client ID/Secret from AppConfig
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    let config_path = config_dir.join(".secrets.dat");
    
    if !config_path.exists() {
        return Err("Configuration not found. Please setup the app first.".to_string());
    }

    let encrypted = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let json = decrypt_data(encrypted.trim())?;
    let config: AppConfig = serde_json::from_str(&json).map_err(|e| e.to_string())?;

    // 2. Initialize Auth
    let auth = OneDriveAuth::new(config.client_id, config.client_secret, config_dir);

    // 3. Ensure Tokens (Login or Refresh)
    let tokens = auth.ensure_tokens().await?;

    Ok(tokens.access_token)
}

#[tauri::command]
pub fn list_minecraft_worlds() -> Result<Vec<LocalWorld>, String> {
    let home = dirs::home_dir().ok_or("Could not find home directory")?;
    
    let saves_path = if cfg!(target_os = "windows") {
        home.join("AppData").join("Roaming").join(".minecraft").join("saves")
    } else if cfg!(target_os = "macos") {
        home.join("Library").join("Application Support").join("minecraft").join("saves")
    } else {
        // Linux fallback (standard)
        home.join(".minecraft").join("saves")
    };

    if !saves_path.exists() {
        return Err(format!("Minecraft saves directory not found at {:?}", saves_path));
    }

    let mut worlds = Vec::new();
    let entries = fs::read_dir(saves_path).map_err(|e| e.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        
        if path.is_dir() {
            // Use the directory name as the world name for now
            // Improvement: Parse level.dat to get the real display name
            if let Some(name_os) = path.file_name() {
                if let Some(name) = name_os.to_str() {
                    worlds.push(LocalWorld {
                        name: name.to_string(),
                        path: path.to_string_lossy().to_string(),
                    });
                }
            }
        }
    }

    Ok(worlds)
}
