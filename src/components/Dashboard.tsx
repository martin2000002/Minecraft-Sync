import { World } from "../types";
import { WorldCard } from "./WorldCard";
import { Plus, LayoutGrid, Settings } from "lucide-react";
import { AppConfig } from "./SetupConfig";

interface DashboardProps {
  worlds: World[];
  onSelectWorld: (world: World) => void;
  onSyncNew: () => void;
  onOpenSettings: () => void;
  config: AppConfig;
}

export function Dashboard({ worlds, onSelectWorld, onSyncNew, onOpenSettings, config }: DashboardProps) {
  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-surface-800 pb-6">
        <div className="flex items-start gap-4">
             {/* User Avatar from Config */}
             <button onClick={onOpenSettings} className="group relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-surface-700 hover:border-brand-primary transition-all shadow-lg hover:shadow-brand-primary/20 shrink-0">
                <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${config.avatarId}`} 
                    alt={config.username}
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Settings size={20} className="text-white" />
                </div>
             </button>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-bold text-white tracking-tight">Synced Worlds</h1>
              </div>
              <p className="text-gray-400 text-sm">
                Welcome back, <span className="text-gray-200 font-semibold">{config.username}</span>.
              </p>
            </div>
        </div>
        
        <button 
          onClick={onSyncNew}
          className="group relative overflow-hidden bg-brand-primary text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all duration-300 active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <Plus size={20} strokeWidth={3} className="relative z-10 transition-transform group-hover:rotate-90" />
          <span className="relative z-10">Sync New World</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {worlds.map((world, idx) => (
          <WorldCard 
            key={world.id} 
            world={world} 
            onClick={onSelectWorld}
            index={idx}
          />
        ))}

        {/* Empty State */}
        {worlds.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-surface-800 rounded-3xl bg-surface-900/30 animate-scale-in">
             <div className="inline-flex p-4 rounded-full bg-surface-800/50 mb-4 text-gray-500">
               <LayoutGrid size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No worlds synced yet</h3>
             <p className="text-gray-500 max-w-sm mx-auto">Start your journey by syncing your first local Minecraft world to the cloud.</p>
          </div>
        )}
      </div>
    </div>
  );
}
