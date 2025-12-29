import { Commit } from "../types";
import { GitCommit, Calendar, User as UserIcon } from "lucide-react";

interface CommitLogProps {
  commits: Commit[];
}

export function CommitLog({ commits }: CommitLogProps) {
  return (
    <div className="space-y-6 pl-2">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <GitCommit className="text-brand-primary" />
        World History
      </h3>
      
      <div className="relative border-l-2 border-surface-700 space-y-8 pb-4">
        {commits.map((commit, index) => (
          <div key={commit.id} className="relative pl-6">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-surface-900 border-2 border-brand-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            
            <div className="bg-surface-800/50 rounded-lg p-4 border border-surface-700 hover:border-surface-600 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                  {commit.id.substring(0, 7)}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} />
                  {commit.date}
                </span>
              </div>
              
              <p className="text-gray-200 font-medium mb-2">{commit.message}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-6 h-6 rounded-full bg-surface-700 flex items-center justify-center overflow-hidden border border-surface-600">
                   {commit.user.avatarUrl ? (
                     <img src={commit.user.avatarUrl} alt={commit.user.name} />
                   ) : (
                     <UserIcon size={12} />
                   )}
                </div>
                <span>{commit.user.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
