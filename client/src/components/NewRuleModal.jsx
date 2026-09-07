import React, { useState } from 'react';
import { X, Plus, BookOpen, AlertTriangle } from 'lucide-react';

export default function NewRuleModal({ isOpen, onClose, onAddRule, currentUser }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Sac & Metal');
  const [importance, setImportance] = useState('high');

  if (!isOpen) return null;

  const categories = [
    'Sac & Metal',
    'Rulman & Kayış',
    'Hırdavat & Cıvata',
    'Yağ & Kimyasal',
    'Kalıp & Aparat',
    'Güvenlik & Düzen',
    'Genel'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddRule({
      title: title.trim(),
      content: content.trim(),
      category,
      importance,
      created_by: currentUser
    });

    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Yeni Kritik Kural / Püf Noktası</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kural Başlığı <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Sac Verilme Kuralı (Öncelik Sırası)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Önem Seviyesi
              </label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
              >
                <option value="critical">🚨 Kritik Kural (Asla Unutma)</option>
                <option value="high">⚠️ Önemli Kural</option>
                <option value="normal">💡 Püf Noktası / Tavsiye</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kural Açıklaması & Püf Noktası <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Örn: Sac verildiğinde mutlaka İLK OLARAK badem desenli sac verilecektir. Eski stok eritilmeden düz saclar dağıtılamaz..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Kuralı Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
