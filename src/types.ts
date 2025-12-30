export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Commit {
  id: string;
  user: User;
  date: string;
  message: string; // "Backup", "Manual Save", etc.
}

export interface World {
  id: string;
  name: string;
  imageUrl: string;
  isHosted: boolean;
  hostUser?: User;
  lastPlayed?: string;
  status: 'synced' | 'uploading' | 'error';
  uploadProgress?: number; // 0-100
  commits: Commit[];
}

export interface AppConfig {
  username: string;
  avatarId: string;
  clientId: string;
  clientSecret: string;
}

export interface LocalWorld {
  name: string;
  path: string;
}
