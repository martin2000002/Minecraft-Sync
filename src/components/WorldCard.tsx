import { World } from "../types";
import { UploadCloud, Users, Clock } from "lucide-react";

interface WorldCardProps {
  world: World;
  onClick: (world: World) => void;
  index?: number;
}

export function WorldCard({ world, onClick, index = 0 }: WorldCardProps) {
  // Calculate stagger delay based on index
  const delayClass = `delay-${Math.min(index * 100, 500)}`;

  return (
    <div 
      onClick={() => onClick(world)}
      className={`group relative rounded-2xl overflow-hidden bg-surface-900 border border-surface-800 transition-all duration-500 cursor-pointer 
        hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:border-brand-primary/40 hover:-translate-y-2
        animate-slide-up opacity-0 fill-mode-forwards ${delayClass}`}
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image Container */}
      <div className="h-48 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/20 to-transparent z-10 opacity-80" />
        <img 
          src={world.imageUrl} 
          alt={world.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-30 flex gap-2">
          {world.isHosted ? (
            <span className="flex items-center gap-1.5 bg-brand-accent/20 backdrop-blur-md text-brand-accent text-xs font-bold px-3 py-1.5 rounded-full border border-brand-accent/30 shadow-[0_0_15px_rgba(34,197,94,0.4)] overflow-hidden">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
              </span>
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative z-20 -mt-10">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors drop-shadow-lg truncate">
          {world.name}
        </h3>
        
        <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
           {world.isHosted ? (
             <div className="flex items-center gap-1.5 text-brand-accent font-medium">
                <Users size={14} />
                <span className="truncate max-w-[150px]">Hosted by {world.hostUser?.name}</span>
             </div>
           ) : (
             <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>Last played {world.lastPlayed}</span>
             </div>
           )}
        </div>

        {/* Uploading State with Animated Stripe */}
        {world.status === 'uploading' ? (
          <div className="mt-3 space-y-2 bg-surface-800/50 p-3 rounded-lg border border-surface-700">
            <div className="flex justify-between text-xs text-brand-primary font-medium">
              <span className="flex items-center gap-1.5 animate-pulse"><UploadCloud size={14}/> Syncing to Cloud...</span>
              <span>{world.uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-surface-950 rounded-full overflow-hidden border border-surface-700/50">
              <div 
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary relative overflow-hidden transition-all duration-300 ease-out"
                style={{ width: `${world.uploadProgress}%` }}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-0 group-hover:h-1 w-full bg-brand-primary/50 mt-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
        )}
      </div>
    </div>
  );
}
