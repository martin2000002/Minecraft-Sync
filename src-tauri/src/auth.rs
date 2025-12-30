use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::io::{Read, Write};
use std::net::TcpListener;
use reqwest::Client;
use url::Url;
use crate::security::{encrypt_data, decrypt_data, hide_file};

const TOKEN_ENDPOINT: &str = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const AUTH_ENDPOINT: &str = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const REDIRECT_URI: &str = "http://localhost:8080";
const SCOPES: &str = "Files.ReadWrite offline_access";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TokenData {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_in: i64,
    pub obtained_at: i64,
    pub expires_at: i64,
}

#[derive(Serialize, Deserialize, Debug)]
struct OAuthResponse {
    access_token: String,
    refresh_token: Option<String>,
    expires_in: i64,
    scope: Option<String>,
    token_type: Option<String>,
}

pub struct OneDriveAuth {
    client_id: String,
    client_secret: String,
    token_path: PathBuf,
}

impl OneDriveAuth {
    pub fn new(client_id: String, client_secret: String, app_config_dir: PathBuf) -> Self {
        let token_path = app_config_dir.join(".tokens.dat");
        Self {
            client_id,
            client_secret,
            token_path,
        }
    }

    fn save_tokens(&self, response: OAuthResponse) -> Result<TokenData, String> {
        let now = chrono::Utc::now().timestamp();
        // 60s safety margin
        let expires_at = now + response.expires_in - 60;

        let mut token_data = TokenData {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            expires_in: response.expires_in,
            obtained_at: now,
            expires_at,
        };

        // If new response doesn't have refresh token, try to keep the old one
        if token_data.refresh_token.is_none() {
            if let Ok(Some(old_tokens)) = self.load_tokens() {
                token_data.refresh_token = old_tokens.refresh_token;
            }
        }

        let json = serde_json::to_string(&token_data).map_err(|e| e.to_string())?;
        let encrypted = encrypt_data(&json)?;

        if let Some(parent) = self.token_path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }

        fs::write(&self.token_path, encrypted).map_err(|e| e.to_string())?;
        hide_file(&self.token_path);

        Ok(token_data)
    }

    fn load_tokens(&self) -> Result<Option<TokenData>, String> {
        if !self.token_path.exists() {
            return Ok(None);
        }

        let encrypted = fs::read_to_string(&self.token_path).map_err(|e| e.to_string())?;
        let json = decrypt_data(encrypted.trim())?;
        let data: TokenData = serde_json::from_str(&json).map_err(|e| e.to_string())?;

        Ok(Some(data))
    }

    fn is_expired(&self, tokens: &TokenData) -> bool {
        let now = chrono::Utc::now().timestamp();
        now >= tokens.expires_at
    }

    pub async fn ensure_tokens(&self) -> Result<TokenData, String> {
        if let Some(tokens) = self.load_tokens()? {
            if !self.is_expired(&tokens) {
                return Ok(tokens);
            }
            println!("Tokens expired, refreshing...");
            return self.refresh_tokens(&tokens).await;
        }
        println!("No tokens found, starting interactive login...");
        self.interactive_login().await
    }

    #[allow(dead_code)]
    pub async fn get_access_token(&self) -> Result<String, String> {
        let tokens = self.ensure_tokens().await?;
        Ok(tokens.access_token)
    }

    async fn refresh_tokens(&self, old_tokens: &TokenData) -> Result<TokenData, String> {
        let refresh_token = old_tokens.refresh_token.as_ref() 
            .ok_or("No refresh token available")?;

        let client = Client::new();
        let params = [
            ("client_id", self.client_id.as_str()),
            ("client_secret", self.client_secret.as_str()),
            ("refresh_token", refresh_token.as_str()),
            ("grant_type", "refresh_token"),
        ];

        let res = client.post(TOKEN_ENDPOINT)
            .form(&params)
            .send()
            .await
            .map_err(|e| format!("Refresh request failed: {}", e))?;

        if !res.status().is_success() {
             let error_text = res.text().await.unwrap_or_default();
             return Err(format!("Refresh token failed: {}", error_text));
        }

        let oauth_res: OAuthResponse = res.json().await
            .map_err(|e| format!("Failed to parse refresh response: {}", e))?;

        self.save_tokens(oauth_res)
    }

    async fn interactive_login(&self) -> Result<TokenData, String> {
        // 1. Start Local Server
        let listener = TcpListener::bind("127.0.0.1:8080")
            .map_err(|e| format!("Failed to bind to port 8080: {}", e))?;
        
        // 2. Open Browser
        let auth_url = Url::parse_with_params(AUTH_ENDPOINT, &[
            ("client_id", self.client_id.as_str()),
            ("response_type", "code"),
            ("redirect_uri", REDIRECT_URI),
            ("scope", SCOPES),
        ]).map_err(|e| e.to_string())?;

        open::that(auth_url.to_string()).map_err(|e| format!("Failed to open browser: {}", e))?;

        // 3. Wait for Code
        let code: String;
        match listener.accept() {
            Ok((mut stream, _)) => {
                let mut buffer = [0; 1024];
                stream.read(&mut buffer).unwrap();
                let request = String::from_utf8_lossy(&buffer);
                
                // Parse code from GET request line
                // "GET /?code=M... HTTP/1.1"
                let start = request.find("code=").ok_or("No code found in request")? + 5;
                let end = request[start..].find(' ').unwrap_or(request.len());
                code = request[start..start+end].to_string();

                let response = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n
                <!DOCTYPE html>
                <html lang=\"en\">
                <head>
                    <meta charset=\"UTF-8\">
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                    <title>Authorization Successful</title>
                    <style>
                        :root {
                            --color-surface-950: #0a0a0a;
                            --color-surface-900: #121212;
                            --color-surface-800: #1e1e1e;
                            --color-brand-primary: #3b82f6;
                            --color-text-main: #ededed;
                            --color-text-muted: #a1a1aa;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: var(--color-surface-950);
                            color: var(--color-text-main);
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            overflow: hidden;
                        }
                        .container {
                            text-align: center;
                            background-color: var(--color-surface-900);
                            padding: 3rem;
                            border-radius: 24px;
                            border: 1px solid rgba(255, 255, 255, 0.05);
                            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                            max-width: 400px;
                            width: 90%;
                            animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                            position: relative;
                            overflow: hidden;
                        }
                        .container::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 4px;
                            background: linear-gradient(90deg, var(--color-brand-primary), #22c55e);
                        }
                        .icon-circle {
                            width: 80px;
                            height: 80px;
                            background-color: rgba(59, 130, 246, 0.1);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 1.5rem;
                            color: var(--color-brand-primary);
                        }
                        h1 {
                            font-size: 1.5rem;
                            font-weight: 700;
                            margin: 0 0 0.75rem;
                            letter-spacing: -0.025em;
                        }
                        p {
                            color: var(--color-text-muted);
                            line-height: 1.6;
                            margin: 0 0 2rem;
                            font-size: 0.95rem;
                        }
                        .badge {
                            display: inline-block;
                            padding: 0.25rem 0.75rem;
                            background-color: var(--color-surface-800);
                            border-radius: 9999px;
                            font-size: 0.75rem;
                            font-weight: 600;
                            color: var(--color-text-muted);
                            border: 1px solid rgba(255,255,255,0.05);
                        }
                        @keyframes scaleIn {
                            from { opacity: 0; transform: scale(0.95); }
                            to { opacity: 1; transform: scale(1); }
                        }
                        svg {
                            width: 40px;
                            height: 40px;
                        }
                    </style>
                </head>
                <body>
                    <div class=\"container\">
                        <div class=\"icon-circle\">
                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"22 4 12 14.01 9 11.01\"></polyline></svg>
                        </div>
                        <h1>Authorization Successful</h1>
                        <p>You have successfully logged in. You can now close this window and return to the <strong>Minecraft Sync</strong> app.</p>
                        <div class=\"badge\">Safe to close</div>
                    </div>
                </body>
                </html>";
                stream.write(response.as_bytes()).unwrap();
                stream.flush().unwrap();
            }
            Err(e) => return Err(format!("Connection failed: {}", e)),
        }

        // 4. Exchange Code for Tokens
        self.exchange_code_for_tokens(&code).await
    }

    async fn exchange_code_for_tokens(&self, code: &str) -> Result<TokenData, String> {
        let client = Client::new();
        let params = [
            ("client_id", self.client_id.as_str()),
            ("client_secret", self.client_secret.as_str()),
            ("code", code),
            ("redirect_uri", REDIRECT_URI),
            ("grant_type", "authorization_code"),
        ];

        let res = client.post(TOKEN_ENDPOINT)
            .form(&params)
            .send()
            .await
            .map_err(|e| format!("Token exchange request failed: {}", e))?;

        if !res.status().is_success() {
             let error_text = res.text().await.unwrap_or_default();
             return Err(format!("Token exchange failed: {}", error_text));
        }

        let oauth_res: OAuthResponse = res.json().await
            .map_err(|e| format!("Failed to parse token response: {}", e))?;

        self.save_tokens(oauth_res)
    }
}
