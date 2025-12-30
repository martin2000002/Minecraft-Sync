import { World } from "../types";
import { CommitLog } from "./CommitLog";
import { ArrowLeft, Play, Download, Upload, Server, Settings, Zap } from "lucide-react";

interface WorldDetailProps {
  world: World;
  onBack: () => void;
}

export function WorldDetail({ world, onBack }: WorldDetailProps) {
  return (
    <div className="animate-fade-in pb-20">
      {/* Header / Nav */}
      <button 
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium hover:-translate-x-1"
      >
        <div className="p-1.5 rounded-full bg-surface-800 group-hover:bg-brand-primary/20 transition-colors">
          <ArrowLeft size={16} className="group-hover:text-brand-primary" />
        </div>
        Back to Worlds
      </button>

      {/* Hero Section */}
      <div className="relative h-[350px] rounded-3xl overflow-hidden mb-8 border border-surface-700/50 shadow-2xl group animate-scale-in">
         <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-900/60 to-transparent z-10" />
         <div className="absolute inset-0 bg-brand-primary/5 mix-blend-overlay z-10" />
         
         <img 
           src={world.imageUrl} 
           alt={world.name} 
           className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
         />
         
         <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="animate-slide-up delay-100 opacity-0 fill-mode-forwards">
              <h1 className="text-5xl font-black text-white mb-3 tracking-tight drop-shadow-xl">{world.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${world.isHosted ? 'bg-brand-accent/20 border-brand-accent/40 text-brand-accent' : 'bg-surface-800/80 border-surface-600'}`}>
                  <Server size={14} />
                  {world.isHosted ? "ONLINE SERVER" : "OFFLINE"}
                </span>
                <span className="text-sm opacity-80 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Last synced: {world.lastPlayed}</span>
              </div>
            </div>

            {/* Main Action - Play */}
            <button className="animate-slide-up delay-200 opacity-0 fill-mode-forwards group/btn relative overflow-hidden bg-white text-black font-bold py-4 px-10 rounded-full flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.6)] transition-all hover:scale-105 active:scale-95">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              <Play fill="currentColor" className="relative z-10" />
              <span className="relative z-10 text-lg">PLAY NOW</span>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Actions & Stats */}
        <div className="space-y-6 animate-slide-up delay-300 opacity-0 fill-mode-forwards">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
              <Zap size={14} className="text-brand-primary" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-surface-800/40 hover:bg-surface-700/60 rounded-xl border border-transparent hover:border-brand-primary/30 transition-all duration-300 text-gray-200 group active:scale-98">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-800 text-brand-accent group-hover:scale-110 transition-transform">
                    <Download size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">Pull World</span>
                    <span className="block text-[10px] text-gray-500">Download from cloud</span>
                  </div>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-surface-800/40 hover:bg-surface-700/60 rounded-xl border border-transparent hover:border-brand-primary/30 transition-all duration-300 text-gray-200 group active:scale-98">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-800 text-blue-400 group-hover:scale-110 transition-transform">
                    <Upload size={20} />
                  </div>
                  <div className="text-left">
                     <span className="block font-bold text-sm">Push World</span>
                     <span className="block text-[10px] text-gray-500">Upload changes</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
           <div className="glass-panel rounded-2xl p-6">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-5">Configuration</h3>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-surface-800 transition-all duration-300">
                <Settings size={20} />
                <span className="font-medium">World Settings</span>
              </button>
           </div>
        </div>

        {/* Right Col: History */}
        <div className="lg:col-span-2">
           <div className="bg-surface-900/30 rounded-2xl p-8 border border-surface-800/50 backdrop-blur-sm">
             <CommitLog commits={world.commits} />
           </div>
        </div>
      </div>
    </div>
  );
}
