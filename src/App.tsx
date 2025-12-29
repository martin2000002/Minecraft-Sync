import { useState, useEffect } from "react";
import "./App.css";
import { Dashboard } from "./components/Dashboard";
import { WorldDetail } from "./components/WorldDetail";
import { World, User, Commit } from "./types";

// --- MOCK DATA ---
const MOCK_USER: User = {
  id: "u1",
  name: "Steve",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Steve"
};

const MOCK_COMMITS: Commit[] = [
  { id: "c1", user: MOCK_USER, date: "2023-12-28 14:30", message: "Built the iron farm" },
  { id: "c2", user: { ...MOCK_USER, name: "Alex" }, date: "2023-12-27 09:15", message: "Explored the nether" },
  { id: "c3", user: MOCK_USER, date: "2023-12-26 18:45", message: "Started the base" },
];

const INITIAL_WORLDS: World[] = [
  {
    id: "w1",
    name: "Survival Season 4",
    imageUrl: "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=600&auto=format&fit=crop",
    isHosted: true,
    hostUser: MOCK_USER,
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
  const [worlds, setWorlds] = useState<World[]>(INITIAL_WORLDS);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);

  // Mock Upload Simulation
  const handleSyncNew = () => {
    const newWorldId = `w${Date.now()}`;
    const newWorld: World = {
      id: newWorldId,
      name: `New World ${worlds.length + 1}`,
      imageUrl: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=600&auto=format&fit=crop", // Different image
      isHosted: false,
      lastPlayed: "Just now",
      status: "uploading",
      uploadProgress: 0,
      commits: []
    };

    setWorlds(prev => [newWorld, ...prev]);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setWorlds(prev => prev.map(w => {
        if (w.id === newWorldId) {
          return { ...w, uploadProgress: progress };
        }
        return w;
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setWorlds(prev => prev.map(w => {
          if (w.id === newWorldId) {
            return { ...w, status: "synced", uploadProgress: undefined };
          }
          return w;
        }));
      }
    }, 500);
  };

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      {selectedWorld ? (
        <WorldDetail 
          world={selectedWorld} 
          onBack={() => setSelectedWorld(null)} 
        />
      ) : (
        <Dashboard 
          worlds={worlds} 
          onSelectWorld={setSelectedWorld} 
          onSyncNew={handleSyncNew} 
        />
      )}
    </div>
  );
}

export default App;