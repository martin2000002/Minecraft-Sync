import { World } from "../types";
import { CommitLog } from "./CommitLog";
import { ArrowLeft, Play, Download, Upload, Server, Settings } from "lucide-react";

interface WorldDetailProps {
  world: World;
  onBack: () => void;
}

export function WorldDetail({ world, onBack }: WorldDetailProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header / Nav */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Worlds
      </button>

      {/* Hero Section */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-8 border border-surface-700 shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/50 to-transparent z-10" />
         <img 
           src={world.imageUrl} 
           alt={world.name} 
           className="w-full h-full object-cover"
         />
         
         <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 shadow-sm">{world.name}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1.5 text-xs bg-surface-800/80 backdrop-blur px-3 py-1 rounded-full border border-surface-600">
                  <Server size={12} />
                  {world.isHosted ? "Server Online" : "Offline"}
                </span>
                <span className="text-sm opacity-80">Last synced: {world.lastPlayed}</span>
              </div>
            </div>

            {/* Main Action - Play */}
            <button className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-full flex items-center gap-3 shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all hover:scale-105 active:scale-95">
              <Play fill="currentColor" />
              PLAY NOW
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Actions & Stats */}
        <div className="space-y-6">
          <div className="bg-surface-800 rounded-xl p-6 border border-surface-700">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Sync Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-surface-700/50 hover:bg-surface-700 rounded-lg border border-transparent hover:border-brand-primary/30 transition-all text-gray-200 group">
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-brand-accent group-hover:text-brand-accent/80" />
                  <span className="font-medium">Manual Pull</span>
                </div>
                <span className="text-xs text-gray-500">Download latest</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-surface-700/50 hover:bg-surface-700 rounded-lg border border-transparent hover:border-brand-primary/30 transition-all text-gray-200 group">
                <div className="flex items-center gap-3">
                  <Upload size={18} className="text-blue-400 group-hover:text-blue-300" />
                  <span className="font-medium">Manual Push</span>
                </div>
                <span className="text-xs text-gray-500">Upload local changes</span>
              </button>
            </div>
          </div>
          
           <div className="bg-surface-800 rounded-xl p-6 border border-surface-700">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Settings</h3>
              <button className="w-full flex items-center gap-3 p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={18} />
                <span>World Configuration</span>
              </button>
           </div>
        </div>

        {/* Right Col: History */}
        <div className="lg:col-span-2">
           <div className="bg-surface-800/30 rounded-xl p-6 border border-surface-700/50">
             <CommitLog commits={world.commits} />
           </div>
        </div>
      </div>
    </div>
  );
}
