import { useState } from "react";
import { User, Lock, Key, Save, Check, Eye, EyeOff, ShieldCheck, X } from "lucide-react";
import { AppConfig } from "../types";
import { saveConfig } from "../api";

interface SetupConfigProps {
  onSave: (config: AppConfig) => void;
  onCancel?: () => void;
  initialConfig?: AppConfig;
}

const AVATARS = [
  "Steve", "Alex", "Felix", "Zoe", "Jack", "Luna", "Max", "Ivy"
];

export function SetupConfig({ onSave, onCancel, initialConfig }: SetupConfigProps) {
  const [username, setUsername] = useState(initialConfig?.username || "");
  const [clientId, setClientId] = useState(initialConfig?.clientId || "");
  const [clientSecret, setClientSecret] = useState(initialConfig?.clientSecret || "");
  const [showSecret, setShowSecret] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(initialConfig?.avatarId || AVATARS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newConfig: AppConfig = {
        username,
        avatarId: selectedAvatar,
        clientId,
        clientSecret
    };

    try {
        await saveConfig(newConfig);
        onSave(newConfig);
    } catch (error) {
        console.error("Error saving config:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in bg-surface-950 relative">
      
      {/* Cancel Button (Only if initialConfig exists) */}
      {initialConfig && onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-3 rounded-full bg-surface-900 text-gray-400 hover:text-white hover:bg-surface-800 transition-all z-50 border border-surface-800 shadow-lg"
          aria-label="Close Settings"
        >
          <X size={24} />
        </button>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Welcome & Info (Desktop) / Top (Mobile) */}
        <div className="text-center lg:text-left space-y-6 order-1 lg:order-none">
           <div className="inline-flex p-5 rounded-3xl bg-brand-primary/10 text-brand-primary mb-2 animate-float">
             <User size={64} strokeWidth={1.5} />
           </div>
           
           <div className="space-y-2">
             <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
               {initialConfig ? "Edit Profile" : "Welcome Player"}
             </h1>
             <p className="text-gray-400 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
               {initialConfig 
                 ? "Update your configuration details or change your avatar."
                 : "Configure your profile to start syncing your Minecraft worlds across devices securely."
               }
             </p>
           </div>

           <div className="hidden lg:flex items-center gap-3 text-sm text-gray-500 bg-surface-900/50 p-4 rounded-xl border border-surface-800 max-w-sm">
              <ShieldCheck className="text-brand-accent shrink-0" size={24} />
              <p>Your credentials are encrypted and stored securely on your device.</p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden order-2 border border-white/5 bg-surface-900/40">
           {/* Decorative sheen */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />

           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 gap-6">
                
                {/* Avatar Selection - Compact Grid */}
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Select Avatar</label>
                   <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
                      {AVATARS.map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => setSelectedAvatar(avatar)}
                            className={`relative w-14 h-14 lg:w-auto lg:aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                              selectedAvatar === avatar 
                              ? "border-brand-primary shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-110 z-10" 
                              : "border-transparent bg-surface-800/50 opacity-60 hover:opacity-100 hover:scale-105"
                            }`}
                          >
                              <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`} 
                                alt={avatar}
                                className="w-full h-full object-cover" 
                              />
                              {selectedAvatar === avatar && (
                                  <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                                      <Check size={14} className="text-white drop-shadow-md" />
                                  </div>
                              )}
                          </button>
                      ))}
                   </div>
                </div>

                {/* Inputs Group */}
                <div className="space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="Minecraft Username"
                          className="w-full bg-surface-950/60 border border-surface-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                        />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Client ID</label>
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input 
                              type="text" 
                              value={clientId}
                              onChange={(e) => setClientId(e.target.value)}
                              required
                              placeholder="ID"
                              className="w-full bg-surface-950/60 border border-surface-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-mono text-sm"
                            />
                         </div>
                       </div>

                       <div className="space-y-1.5">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Client Secret</label>
                         <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input 
                              type={showSecret ? "text" : "password"}
                              value={clientSecret}
                              onChange={(e) => setClientSecret(e.target.value)}
                              required
                              placeholder="Secret"
                              className="w-full bg-surface-950/60 border border-surface-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-mono text-sm"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowSecret(!showSecret)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                            >
                              {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                         </div>
                       </div>
                   </div>
                </div>
             </div>

             <button 
               type="submit"
               disabled={isLoading}
               className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
             >
               {isLoading ? (
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                   <>
                      <Save size={20} />
                      <span>{initialConfig ? "Update Profile" : "Save Profile"}</span>
                   </>
               )}
             </button>
          </form>
          
          <div className="lg:hidden mt-6 text-center">
             <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                <ShieldCheck size={14} />
                Credentials stored locally & securely.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
