import React, { useState } from 'react';
import { X, Plus, Terminal, Search, Copy, Check, Trash2, AlertCircle } from 'lucide-react';

export default function SapDrawerModal({ isOpen, onClose, sapGuides, onDeleteSap, onOpenNewModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTcode, setSelectedTcode] = useState('Tümü');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const uniqueTcodes = ['Tümü', ...Array.from(new Set(sapGuides.map((g) => g.tcode)))];

  const filteredGuides = sapGuides.filter((guide) => {
    const matchesTcode = selectedTcode === 'Tümü' || guide.tcode === selectedTcode;
    const matchesSearch =
      guide.tcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.movement_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.steps.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTcode && matchesSearch;
  });

  const handleCopy = (guide) => {
    navigator.clipboard.writeText(`${guide.tcode} - ${guide.title}\n${guide.steps}\nİpucu: ${guide.tips}`);
    setCopiedId(guide.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">SAP Depo Süreç Kılavuzu</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Nadir kullanılan veya unutulan işlem kodları</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewModal}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Kod
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kod veya işlem ara (örn: MIGO, 311, 201...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {uniqueTcodes.map((tc) => (
              <button
                key={tc}
                onClick={() => setSelectedTcode(tc)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedTcode === tc
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {tc}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredGuides.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">Kayıtlı SAP işlemi bulunamadı.</div>
          ) : (
            filteredGuides.map((guide) => (
              <div key={guide.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                      {guide.tcode}
                    </span>
                    {guide.movement_type && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {guide.movement_type}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(guide)}
                      className="text-slate-400 hover:text-emerald-300 p-1 rounded hover:bg-slate-800"
                      title="Kopyala"
                    >
                      {copiedId === guide.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${guide.title}" silinsin mi?`)) onDeleteSap(guide.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-white">{guide.title}</div>
                <div className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {guide.steps}
                </div>

                {guide.tips && (
                  <div className="text-[11px] text-amber-300 flex items-start gap-1.5 bg-amber-950/20 p-2 rounded-lg border border-amber-800/30">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{guide.tips}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
