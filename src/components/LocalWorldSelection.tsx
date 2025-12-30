import { useState, useEffect } from "react";
import { X, Globe, FolderOpen, Loader2, AlertCircle } from "lucide-react";
import { LocalWorld } from "../types";
import { listMinecraftWorlds } from "../api";

interface LocalWorldSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (world: LocalWorld) => void;
}

export function LocalWorldSelection({ isOpen, onClose, onSelect }: LocalWorldSelectionProps) {
  const [worlds, setWorlds] = useState<LocalWorld[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadWorlds();
    }
  }, [isOpen]);

  const loadWorlds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listMinecraftWorlds();
      setWorlds(data);
    } catch (err: any) {
      setError("Failed to load local Minecraft worlds. Make sure Minecraft is installed in the default location.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-900 w-full max-w-lg rounded-2xl border border-surface-700 shadow-2xl animate-scale-in flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-surface-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe size={20} className="text-brand-primary" />
              Select World to Sync
            </h2>
            <p className="text-sm text-gray-400 mt-1">Choose a local world to upload to the cloud.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center text-gray-500 gap-3">
              <Loader2 size={32} className="animate-spin text-brand-primary" />
              <p>Scanning saves directory...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
               <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertCircle size={32} />
               </div>
               <p className="text-red-400 mb-4">{error}</p>
               <button 
                  onClick={loadWorlds}
                  className="px-4 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg text-white text-sm transition-colors"
               >
                  Try Again
               </button>
            </div>
          ) : worlds.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
               <FolderOpen size={48} className="mx-auto mb-3 opacity-50" />
               <p>No local worlds found.</p>
            </div>
          ) : (
            <div className="grid gap-2 p-2">
              {worlds.map((world) => (
                <button
                  key={world.path}
                  onClick={() => onSelect(world)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-transparent hover:border-brand-primary/30 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-surface-700 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-brand-primary/20 transition-colors">
                    <Globe size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate group-hover:text-brand-primary transition-colors">
                      {world.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate font-mono mt-0.5 opacity-60">
                      {world.path}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
