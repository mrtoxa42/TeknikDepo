import React, { useState } from 'react';
import { X, Plus, Pin, CheckSquare, Clock, Tag } from 'lucide-react';

export default function NewCardModal({ isOpen, onClose, onAddCard, currentUser, initialCol = 'notes' }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [boardCol, setBoardCol] = useState(initialCol);
  const [color, setColor] = useState('amber'); // amber, blue, rose, emerald, purple

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'amber', label: 'Sarı', bg: 'bg-amber-500' },
    { id: 'blue', label: 'Mavi', bg: 'bg-blue-500' },
    { id: 'rose', label: 'Kırmızı', bg: 'bg-rose-500' },
    { id: 'emerald', label: 'Yeşil', bg: 'bg-emerald-500' },
    { id: 'purple', label: 'Mor', bg: 'bg-purple-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddCard({
      board_col: boardCol,
      title: title.trim(),
      content: content.trim(),
      color,
      created_by: currentUser
    });

    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Panoya Yeni Kart / Not Ekle</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Sütun / Kategori Seçimi */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hangi Bölüme Eklensin?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBoardCol('notes')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                  boardCol === 'notes'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                Depo Notu
              </button>

              <button
                type="button"
                onClick={() => setBoardCol('todo')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                  boardCol === 'todo'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Yapılacak
              </button>

              <button
                type="button"
                onClick={() => setBoardCol('doing')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                  boardCol === 'doing'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                İşlemde
              </button>
            </div>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Başlık / Malzeme / Konu <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: 4120 Kodlu Kimyasal veya İrsaliye Hazır"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              autoFocus
            />
          </div>

          {/* Not / Açıklama */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detay Notu (Opsiyonel)
            </label>
            <textarea
              rows={3}
              placeholder="Örn: Rafta 1 adet fazla var, raf stok dışı görünmesin diye üstüne yazmadık..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
            />
          </div>

          {/* Renk Etiketi */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kart Rengi
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all ${
                    color === c.id ? 'ring-4 ring-white/30 scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Panoya Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
