import React, { useState } from 'react';
import { 
  Plus, Search, BookOpen, AlertCircle, AlertTriangle, 
  Lightbulb, Trash2, Copy, Check, Tag, User 
} from 'lucide-react';

export default function RulesTab({ rules, onDeleteRule, onOpenNewModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    'Tümü',
    'Sac & Metal',
    'Rulman & Kayış',
    'Hırdavat & Cıvata',
    'Yağ & Kimyasal',
    'Kalıp & Aparat',
    'Güvenlik & Düzen',
    'Genel'
  ];

  const filteredRules = rules.filter((rule) => {
    const matchesCat = selectedCategory === 'Tümü' || rule.category === selectedCategory;
    const matchesSearch = 
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (rule) => {
    navigator.clipboard.writeText(`${rule.title}\n\n${rule.content}`);
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const importanceBadge = (imp) => {
    switch (imp) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertCircle className="w-3 h-3" />
            KRİTİK KURAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Önemli
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Lightbulb className="w-3 h-3" />
            Püf Noktası
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            💡 Kritik Depo Kuralları & Püf Noktaları
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Depoda asla unutulmaması gereken malzeme ve operasyon kuralları
          </p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-600/25 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Kural Ekle
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Kural veya malzeme ara (örn: badem sac, rulman, varil...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
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

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rules list */}
      {filteredRules.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">Eşleşen kural bulunamadı</h3>
          <p className="text-xs text-slate-400 mt-1">Arama teriminizi değiştirin veya yeni kural ekleyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredRules.map((rule) => {
            const isCritical = rule.importance === 'critical';

            return (
              <div
                key={rule.id}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition duration-200 ${
                  isCritical
                    ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-500/5'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {importanceBadge(rule.importance)}
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {rule.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(rule)}
                        className="text-slate-400 hover:text-amber-300 p-1 rounded-lg hover:bg-slate-800 transition"
                        title="Metni Kopyala"
                      >
                        {copiedId === rule.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`"${rule.title}" kuralını silmek istediğinize emin misiniz?`)) {
                            onDeleteRule(rule.id);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                        title="Kuralı Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {rule.title}
                  </h3>

                  {/* Content */}
                  <p className="text-xs text-slate-200 mt-2 whitespace-pre-wrap leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    {rule.content}
                  </p>
                </div>

                {/* Footer metadata */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    Ekleyen: <strong className="text-slate-300">{rule.created_by}</strong>
                  </span>
                  <span>{new Date(rule.updated_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
