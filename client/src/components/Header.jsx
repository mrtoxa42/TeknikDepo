import React from 'react';
import { Package, Wifi, WifiOff, User } from 'lucide-react';

export default function Header({ users, currentUser, onSelectUser, isConnected }) {
  const userColors = {
    Erkan: 'from-emerald-500 to-emerald-700 border-emerald-400',
    Berkay: 'from-blue-500 to-blue-700 border-blue-400',
    Emircan: 'from-amber-500 to-amber-700 border-amber-400'
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {/* Top line: Logo, Title, Real-time status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide leading-none flex items-center gap-2">
                TEKNİK DEPO
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Fabrika
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">Operasyon, Görev & Bilgi Portalı</p>
            </div>
          </div>

          {/* Connection badge */}
          <div className="flex items-center gap-1.5 text-xs">
            {isConnected ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-medium text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Canlı Senkron
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800/80 font-medium text-[11px]">
                <WifiOff className="w-3 h-3" />
                Bağlanıyor...
              </span>
            )}
          </div>
        </div>

        {/* User Switcher Buttons (Erkan, Berkay, Emircan) */}
        <div className="bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-500" />
            Aktif:
          </span>
          <div className="flex items-center gap-1.5 flex-1 justify-end">
            {users.map((u) => {
              const isSelected = currentUser === u.name;
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u.name)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isSelected
                      ? `bg-gradient-to-r ${userColors[u.name] || 'from-sky-600 to-blue-600'} text-white shadow-md ring-2 ring-white/20 scale-[1.02]`
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-500'}`} />
                  {u.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
