use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm 
};
use rand::RngCore;
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};
use std::path::Path;

// WARNING: Hardcoding keys in the binary provides limited security.
// Ideally, use the OS Keychain.
const ENCRYPTION_KEY: &[u8; 32] = b"minecraft_sync_super_secret_key!";

pub fn encrypt_data(data: &str) -> Result<String, String> {
    let cipher = Aes256Gcm::new(ENCRYPTION_KEY.into());
    let mut nonce = [0u8; 12]; // 96-bits; unique per message
    OsRng.fill_bytes(&mut nonce);
    
    let ciphertext = cipher.encrypt(&nonce.into(), data.as_bytes())
        .map_err(|e| format!("Encryption failed: {}", e))?;
    
    // Combine nonce and ciphertext: [nonce (12 bytes)][ciphertext]
    let mut combined = nonce.to_vec();
    combined.extend(ciphertext);
    
    Ok(BASE64.encode(combined))
}

pub fn decrypt_data(encrypted_data: &str) -> Result<String, String> {
    let decoded = BASE64.decode(encrypted_data).map_err(|e| format!("Base64 decode failed: {}", e))?;
    
    if decoded.len() < 12 {
        return Err("Data too short".to_string());
    }
    
    let (nonce, ciphertext) = decoded.split_at(12);
    let cipher = Aes256Gcm::new(ENCRYPTION_KEY.into());
    
    let plaintext = cipher.decrypt(nonce.into(), ciphertext)
        .map_err(|e| format!("Decryption failed: {}", e))?;
        
    String::from_utf8(plaintext).map_err(|e| e.to_string())
}

#[cfg(target_os = "windows")]
pub fn hide_file(path: &Path) {
    use std::process::Command;
    // Best effort to hide the file on Windows
    let _ = Command::new("attrib")
        .arg("+h")
        .arg(path)
        .output();
}

#[cfg(not(target_os = "windows"))]
pub fn hide_file(_path: &Path) {
    // On Unix, dotfiles are hidden by default
}
