import { World } from "../types";
import { Play, UploadCloud, Users, Clock, MoreHorizontal } from "lucide-react";

interface WorldCardProps {
  world: World;
  onClick: (world: World) => void;
}

export function WorldCard({ world, onClick }: WorldCardProps) {
  return (
    <div 
      onClick={() => onClick(world)}
      className="group relative bg-surface-800 rounded-xl overflow-hidden border border-surface-700 hover:border-brand-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-brand-primary/10 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="h-40 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 to-transparent z-10 opacity-60" />
        <img 
          src={world.imageUrl} 
          alt={world.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          {world.isHosted && (
            <span className="flex items-center gap-1.5 bg-brand-accent/20 backdrop-blur-md text-brand-accent text-xs font-bold px-2.5 py-1 rounded-full border border-brand-accent/30 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
              </span>
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative z-20">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">
          {world.name}
        </h3>
        
        <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
           {world.isHosted ? (
             <div className="flex items-center gap-1.5 text-brand-accent">
                <Users size={14} />
                <span>Hosted by {world.hostUser?.name}</span>
             </div>
           ) : (
             <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>Last played {world.lastPlayed}</span>
             </div>
           )}
        </div>

        {/* Uploading State */}
        {world.status === 'uploading' && (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><UploadCloud size={12}/> Syncing...</span>
              <span>{world.uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all duration-300 ease-out"
                style={{ width: `${world.uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
