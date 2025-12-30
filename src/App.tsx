import { useState, useEffect } from "react";
import "./App.css";
import { Dashboard } from "./components/Dashboard";
import { WorldDetail } from "./components/WorldDetail";
import { SetupConfig } from "./components/SetupConfig";
import { LocalWorldSelection } from "./components/LocalWorldSelection";
import { World, Commit, AppConfig, LocalWorld } from "./types";
import { loadConfig, loginOneDrive } from "./api";
import { Loader2, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

// --- MOCK DATA ---
const MOCK_COMMITS: Commit[] = [
  { id: "c1", user: { id: "u1", name: "Steve" }, date: "2023-12-28 14:30", message: "Built the iron farm and fixed the redstone sorter in the main storage room" },
  { id: "c2", user: { id: "u2", name: "Alex" }, date: "2023-12-27 09:15", message: "Explored the nether" },
];

const INITIAL_WORLDS: World[] = [
  {
    id: "w1",
    name: "Survival Season 4",
    imageUrl: "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=600&auto=format&fit=crop",
    isHosted: true,
    hostUser: { id: "u1", name: "Steve" },
    status: "synced",
    commits: MOCK_COMMITS
  },
  {
    id: "w2",
    name: "Creative Plot",
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14bc3d5b248?q=80&w=600&auto=format&fit=crop",
    isHosted: false,
    lastPlayed: "2 days ago",
    status: "synced",
    commits: [MOCK_COMMITS[0]]
  }
];

function App() {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [worlds, setWorlds] = useState<World[]>(INITIAL_WORLDS);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // New State for World Selection Modal
  const [isWorldSelectionOpen, setIsWorldSelectionOpen] = useState(false);

  // Load Config on Mount
  useEffect(() => {
    async function init() {
        try {
            const config = await loadConfig();
            if (config) {
                setAppConfig(config);
                handleAuth();
            }
        } catch (e) {
            console.error("Failed to initialize app config", e);
        } finally {
            setIsLoadingConfig(false);
        }
    }
    init();
  }, []);

  const handleAuth = async () => {
      setIsAuthenticating(true);
      setAuthError(null);
      try {
          await loginOneDrive();
      } catch (e) {
          console.error("Auth failed:", e);
          setAuthError("Authentication failed. Please check your browser and credentials.");
      } finally {
          setIsAuthenticating(false);
      }
  };

  const handleSaveConfig = (config: AppConfig) => {
    setAppConfig(config);
    setIsSettingsOpen(false);
    handleAuth(); 
  };

  const handleSyncNewClick = () => {
    setIsWorldSelectionOpen(true);
  };

  const handleSelectLocalWorld = (localWorld: LocalWorld) => {
    setIsWorldSelectionOpen(false);

    // Simulate Upload Process
    const newWorldId = `w${Date.now()}`;
    const newWorld: World = {
      id: newWorldId,
      name: localWorld.name, // Use real name from folder
      imageUrl: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=600&auto=format&fit=crop", 
      isHosted: false,
      lastPlayed: "Just now",
      status: "uploading",
      uploadProgress: 0,
      commits: []
    };

    setWorlds(prev => [newWorld, ...prev]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setWorlds(prev => prev.map(w => {
        if (w.id === newWorldId) {
          return { ...w, uploadProgress: progress };
        }
        return w;
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
            setWorlds(prev => prev.map(w => {
            if (w.id === newWorldId) {
                return { ...w, status: "synced", uploadProgress: undefined };
            }
            return w;
            }));
        }, 500);
      }
    }, 100);
  };

  // Loading Config State
  if (isLoadingConfig) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-surface-950 text-brand-primary">
              <span className="w-8 h-8 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          </div>
      );
  }

  // Auth Interstitial Screen (Postman-style)
  if (isAuthenticating) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-surface-950 text-white gap-6 animate-fade-in p-6">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full" />
                <div className="relative bg-surface-900 p-6 rounded-3xl border border-surface-800 shadow-2xl flex flex-col items-center text-center max-w-md">
                    <div className="w-16 h-16 bg-surface-800 rounded-full flex items-center justify-center mb-6 relative">
                        <Loader2 size={32} className="text-brand-primary animate-spin" />
                        <div className="absolute top-0 right-0 w-4 h-4 bg-brand-accent rounded-full border-2 border-surface-800 animate-pulse" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        We've opened a browser window for you to log in to Microsoft. Please complete the sign-in process there to continue.
                    </p>

                    <div className="w-full space-y-3">
                        <div className="text-xs text-gray-500 bg-surface-950/50 p-3 rounded-lg border border-surface-800 flex items-center gap-2">
                             <ExternalLink size={14} />
                             <span>Browser window didn't open?</span>
                        </div>
                        
                        <button 
                            onClick={() => window.location.reload()} // Just a visual retry or re-trigger logic
                            className="w-full py-3 rounded-xl border border-surface-700 hover:bg-surface-800 text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <RefreshCw size={16} />
                            Retry Connection
                        </button>
                    </div>
                </div>
              </div>
          </div>
      );
  }

  // Auth Error State
  if (authError && appConfig) {
       return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-surface-950 text-white gap-6 animate-fade-in p-6">
              <div className="bg-surface-900 p-8 rounded-3xl border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] flex flex-col items-center text-center max-w-md">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                      <AlertCircle size={32} />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Authentication Failed</h2>
                  <p className="text-gray-400 mb-8">
                      {authError}
                  </p>

                  <div className="w-full space-y-3">
                      <button 
                          onClick={handleAuth}
                          className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition-colors font-bold shadow-lg shadow-brand-primary/20"
                      >
                          Try Again
                      </button>
                      
                      <button 
                          onClick={() => setIsSettingsOpen(true)}
                          className="w-full py-3 rounded-xl text-gray-400 hover:text-white hover:bg-surface-800 transition-colors"
                      >
                          Check Settings
                      </button>
                  </div>
              </div>
          </div>
       );
  }

  // Render Logic
  if (!appConfig || isSettingsOpen) {
    return (
      <SetupConfig 
        onSave={handleSaveConfig} 
        onCancel={appConfig ? () => setIsSettingsOpen(false) : undefined}
        initialConfig={appConfig || undefined} 
      />
    );
  }

  return (
    <div className="px-6 py-10 min-h-screen">
      {/* Modals */}
      <LocalWorldSelection 
        isOpen={isWorldSelectionOpen} 
        onClose={() => setIsWorldSelectionOpen(false)}
        onSelect={handleSelectLocalWorld}
      />

      {selectedWorld ? (
        <WorldDetail 
          world={selectedWorld} 
          onBack={() => setSelectedWorld(null)} 
        />
      ) : (
        <Dashboard 
          worlds={worlds} 
          config={appConfig}
          onSelectWorld={setSelectedWorld} 
          onSyncNew={handleSyncNewClick} 
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}
    </div>
  );
}

export default App;