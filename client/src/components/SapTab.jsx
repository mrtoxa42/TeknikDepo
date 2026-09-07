import React, { useState } from 'react';
import { Plus, Search, Terminal, AlertCircle, Copy, Check, Trash2, ArrowRight } from 'lucide-react';

export default function SapTab({ sapGuides, onDeleteSap, onOpenNewModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTcode, setSelectedTcode] = useState('Tümü');
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique T-codes for tabs
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
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            ⚡ SAP Depo İşlem Rehberi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            MIGO, transferler, masraf merkezi çıkışları ve stok kodları
          </p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/25 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni SAP Rehberi Ekle
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="İşlem kodu veya hareket ara (örn: MIGO, 311, transfer, MB52...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
          >
            Temizle
          </button>
        )}
      </div>

      {/* T-Code Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {uniqueTcodes.map((tc) => (
          <button
            key={tc}
            onClick={() => setSelectedTcode(tc)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedTcode === tc
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tc}
          </button>
        ))}
      </div>

      {/* Guides list */}
      {filteredGuides.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center">
          <Terminal className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">SAP rehberi bulunamadı</h3>
          <p className="text-xs text-slate-400 mt-1">Aramayı temizleyin veya yeni bir kılavuz ekleyin.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md transition"
            >
              {/* Header line */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs">
                    {guide.tcode}
                  </span>
                  {guide.movement_type && (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                      {guide.movement_type}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(guide)}
                    className="text-slate-400 hover:text-emerald-300 p-1 rounded-lg hover:bg-slate-800 transition"
                    title="Adımları Kopyala"
                  >
                    {copiedId === guide.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${guide.tcode} - ${guide.title}" kılavuzunu silmek istediğinize emin misiniz?`)) {
                        onDeleteSap(guide.id);
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                    title="Kılavuzu Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white mb-2">
                {guide.title}
              </h3>

              {/* Steps */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {guide.steps}
              </div>

              {/* Tips callout if present */}
              {guide.tips && (
                <div className="mt-2.5 bg-amber-950/30 border border-amber-800/40 rounded-xl p-2.5 flex items-start gap-2 text-xs text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-amber-200">İpucu / Püf Noktası:</strong> {guide.tips}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
