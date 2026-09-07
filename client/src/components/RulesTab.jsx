import React, { useState } from 'react';
import { 
  Plus, Search, BookOpen, AlertCircle, AlertTriangle, 
  Lightbulb, Trash2, Copy, Check, ChevronDown, ChevronUp, Tag, User 
} from 'lucide-react';

export default function RulesTab({ rules, onDeleteRule, onOpenNewModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    'Tümü',
    'Sac & Metal',
    'Rulman & Kayış',
    'Hırdavat & Cıvata',
    'Yağ & Kimyasal',
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

  const handleCopy = (rule, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${rule.title}\n\n${rule.content}`);
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white">💡 Depo Kuralları & Püf Noktaları</h2>
          <p className="text-xs text-slate-400">Detayı görmek için kurala dokunun</p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Kural
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Kural veya malzeme ara (örn: badem sac, rulman, varil...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List (Kapalı duran, dokununca açılan temiz liste) */}
      {filteredRules.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Eşleşen kural bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filteredRules.map((rule) => {
            const isExpanded = expandedId === rule.id;
            const isCritical = rule.importance === 'critical';

            return (
              <div
                key={rule.id}
                className={`rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-slate-900/90 border-amber-600/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                {/* Row Header - Always compact */}
                <div
                  onClick={() => toggleExpand(rule.id)}
                  className="flex items-center justify-between gap-2 p-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {isCritical ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">
                        {rule.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">{rule.category}</span>
                        <span>• Ekleyen: {rule.created_by}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80 space-y-2.5 animate-fade-in">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {rule.content}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[10px] text-slate-500">
                        {new Date(rule.updated_at).toLocaleDateString('tr-TR')}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleCopy(rule, e)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                        >
                          {copiedId === rule.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Kopyala
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`"${rule.title}" silinsin mi?`)) onDeleteRule(rule.id);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
