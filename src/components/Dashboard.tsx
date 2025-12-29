import { World } from "../types";
import { WorldCard } from "./WorldCard";
import { Plus } from "lucide-react";

interface DashboardProps {
  worlds: World[];
  onSelectWorld: (world: World) => void;
  onSyncNew: () => void;
}

export function Dashboard({ worlds, onSelectWorld, onSyncNew }: DashboardProps) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Synced Worlds</h1>
          <p className="text-gray-400 mt-1">Manage and sync your Minecraft adventures.</p>
        </div>
        
        <button 
          onClick={onSyncNew}
          className="bg-white text-surface-950 hover:bg-gray-200 font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          Sync New World
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {worlds.map((world) => (
          <WorldCard 
            key={world.id} 
            world={world} 
            onClick={onSelectWorld} 
          />
        ))}

        {/* Empty State / Call to Action Card if needed, or just keep list */}
        {worlds.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-surface-700 rounded-2xl">
             <p className="text-gray-500">No worlds synced yet. Start by syncing a new world!</p>
          </div>
        )}
      </div>
    </div>
  );
}
