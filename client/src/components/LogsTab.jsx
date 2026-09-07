import React, { useState } from 'react';
import { Send, Clock, User, AlertTriangle, Info, Package, Wrench } from 'lucide-react';

export default function LogsTab({ logs, currentUser, onAddLog }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('info');
  const [shift, setShift] = useState('Gündüz Vardiyası');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddLog({
      content: content.trim(),
      category,
      shift,
      created_by: currentUser
    });

    setContent('');
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'warning':
      case 'malfunction':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'material':
        return <Package className="w-4 h-4 text-sky-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          📝 Vardiya & Olay Günlüğü (Logbook)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Günün önemli olayları, arızalar, malzeme devirleri ve anlık notlar
        </p>
      </div>

      {/* Quick Add Log Box */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Hızlı Olay Notu Düş:</span>
            <span className="text-[11px] text-sky-400 font-semibold bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/60">
              {currentUser}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="Gündüz Vardiyası">1. Gündüz</option>
              <option value="Akşam Vardiyası">2. Akşam</option>
              <option value="Gece Vardiyası">3. Gece</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="info">ℹ️ Bilgi</option>
              <option value="material">📦 Malzeme</option>
              <option value="warning">⚠️ Arıza / Uyarı</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            required
            placeholder="Örn: 2. vardiyada hidrolik rakor bitti, satınalmaya bildirildi..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/30 transition flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Paylaş
          </button>
        </div>
      </form>

      {/* Timeline logs */}
      <div className="space-y-2.5">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3 flex items-start gap-3 text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
              {getCategoryIcon(log.category)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-[12px]">{log.created_by}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {log.shift}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed break-words">
                {log.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
