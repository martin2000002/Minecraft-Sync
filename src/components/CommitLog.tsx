import { Commit } from "../types";
import { GitCommit, Calendar, User as UserIcon } from "lucide-react";

interface CommitLogProps {
  commits: Commit[];
}

export function CommitLog({ commits }: CommitLogProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-3 mb-6 sticky top-0 bg-surface-950/80 backdrop-blur-sm py-2 z-10 border-b border-surface-800">
        <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
          <GitCommit size={20} />
        </div>
        World History
      </h3>
      
      <div className="relative border-l-2 border-surface-700/50 space-y-8 pb-4 ml-3">
        {commits.map((commit, index) => (
          <div 
            key={commit.id} 
            className="relative pl-8 animate-slide-up opacity-0 fill-mode-forwards"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-6 h-4 w-4 rounded-full bg-surface-900 border-2 border-brand-primary shadow-[0_0_12px_rgba(59,130,246,0.6)] z-10 group-hover:scale-125 transition-transform" />
            
            <div className="group glass-panel rounded-xl p-5 hover:border-brand-primary/30 transition-all duration-300 hover:bg-surface-800/60 hover:translate-x-2">
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1 rounded border border-brand-primary/20">
                  {commit.id.substring(0, 7)}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1.5 bg-surface-950/50 px-2 py-1 rounded-full">
                  <Calendar size={12} />
                  {commit.date}
                </span>
              </div>
              
              <p className="text-gray-100 font-medium mb-4 text-sm leading-relaxed">{commit.message}</p>
              
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center overflow-hidden border border-surface-600 ring-2 ring-surface-800 group-hover:ring-brand-primary/30 transition-all">
                   {commit.user.avatarUrl ? (
                     <img src={commit.user.avatarUrl} alt={commit.user.name} className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon size={14} className="text-gray-400" />
                   )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{commit.user.name}</span>
                  <span className="text-[10px] text-gray-500">Committer</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}