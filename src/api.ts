import { invoke } from "@tauri-apps/api/core";
import { AppConfig, LocalWorld } from "./types";

export async function saveConfig(config: AppConfig): Promise<void> {
  try {
    await invoke("save_config", { config });
  } catch (error) {
    console.error("Failed to save config:", error);
    throw error;
  }
}

export async function loadConfig(): Promise<AppConfig | null> {
  try {
    return await invoke<AppConfig | null>("load_config");
  } catch (error) {
    console.error("Failed to load config:", error);
    throw error;
  }
}

export async function loginOneDrive(): Promise<string> {
  try {
    return await invoke<string>("login_onedrive");
  } catch (error) {
    console.error("Failed to login to OneDrive:", error);
    throw error;
  }
}

export async function listMinecraftWorlds(): Promise<LocalWorld[]> {
  try {
    return await invoke<LocalWorld[]>("list_minecraft_worlds");
  } catch (error) {
    console.error("Failed to list Minecraft worlds:", error);
    throw error;
  }
}
