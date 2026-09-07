import React from 'react';
import { Package, Wifi, WifiOff, User, Bell, BellRing, Terminal } from 'lucide-react';

export default function Header({ 
  users, 
  currentUser, 
  onSelectUser, 
  isConnected, 
  notificationPermission, 
  onRequestNotification,
  onOpenSapDrawer 
}) {
  const userColors = {
    Erkan: 'from-emerald-500 to-emerald-700 border-emerald-400',
    Berkay: 'from-blue-500 to-blue-700 border-blue-400',
    Emircan: 'from-amber-500 to-amber-700 border-amber-400'
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-3 py-2.5 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
        {/* Line 1: Logo, Title, SAP menu button, Notification toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide leading-none flex items-center gap-1.5">
                TEKNİK DEPO
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Fabrika
                </span>
              </h1>
              <span className="text-[10px] text-slate-400">Vardiya & Bilgi Paneli</span>
            </div>
          </div>

          {/* Right Action Icons: SAP button & Notification button & Live status */}
          <div className="flex items-center gap-1.5">
            {/* SAP quick menu button */}
            <button
              onClick={onOpenSapDrawer}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition active:scale-95"
              title="SAP İşlem Kılavuzu"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">SAP</span>
            </button>

            {/* Notification permission button */}
            <button
              onClick={onRequestNotification}
              className={`p-1.5 rounded-xl border transition active:scale-95 flex items-center gap-1 text-[11px] font-medium ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
              }`}
              title={notificationPermission === 'granted' ? 'Bildirimler Aktif' : 'Bildirimleri Aç'}
            >
              {notificationPermission === 'granted' ? (
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <>
                  <BellRing className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Bildirim</span>
                </>
              )}
            </button>

            {/* Connection dot */}
            <div
              className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-rose-500 animate-ping'}`}
              title={isConnected ? 'Canlı Senkronize' : 'Bağlantı Bekleniyor'}
            />
          </div>
        </div>

        {/* Line 2: User Switcher Buttons (Erkan, Berkay, Emircan) */}
        <div className="bg-slate-950/70 p-1 rounded-xl border border-slate-800/80 flex items-center justify-between gap-1">
          <span className="text-[10px] text-slate-400 font-semibold px-1.5 flex items-center gap-1 shrink-0">
            <User className="w-3 h-3 text-slate-500" />
            Vardiya:
          </span>
          <div className="flex items-center gap-1 flex-1 justify-end">
            {users.map((u) => {
              const isSelected = currentUser === u.name;
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u.name)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isSelected
                      ? `bg-gradient-to-r ${userColors[u.name] || 'from-sky-600 to-blue-600'} text-white shadow-md ring-1 ring-white/30 scale-[1.02]`
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-600'}`} />
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
