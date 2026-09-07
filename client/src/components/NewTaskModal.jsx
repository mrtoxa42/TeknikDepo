import React, { useState } from 'react';
import { X, Plus, AlertCircle, Clock, Calendar } from 'lucide-react';

export default function NewTaskModal({ isOpen, onClose, onAddTask, currentUser, users }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [assignedTo, setAssignedTo] = useState('Hepsi');
  const [dueDate, setDueDate] = useState('Bugün / Acil');
  const [shift, setShift] = useState('Gündüz Vardiyası');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'pending',
      assigned_to: assignedTo,
      created_by: currentUser,
      due_date: dueDate,
      shift
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Yeni İş / Vardiya Notu Ekle</h2>
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
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              İş / Görev Başlığı <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Yarın sabah badem sac sayımı yapılacak"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detaylı Açıklama (Opsiyonel)
            </label>
            <textarea
              rows={2}
              placeholder="Örn: Atölyeye 3 adet verilecek, kalanlar 2. rafa kaldırılacak..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>

          {/* Priority & Assigned to */}
          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Öncelik
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500"
              >
                <option value="urgent">🔥 Acil (Öncelikli)</option>
                <option value="normal">⚡ Normal İş</option>
                <option value="low">☕ Düşük / Zamanı Var</option>
              </select>
            </div>

            {/* Assigned to */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kime Atandı?
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Hepsi">👥 Hepsi (Depo Ekibi)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    👤 {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date & Vardiya */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Zaman / Vade
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Örn: Yarın Sabah Vardiyası"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Vardiya
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Gündüz Vardiyası">1. Gündüz (08:00 - 16:00)</option>
                <option value="Akşam Vardiyası">2. Akşam (16:00 - 24:00)</option>
                <option value="Gece Vardiyası">3. Gece (24:00 - 08:00)</option>
              </select>
            </div>
          </div>

          <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-3 flex items-center gap-2.5 text-xs text-sky-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-sky-400" />
            <span>Ekleyen: <strong>{currentUser}</strong> olarak anında diğer telefonlara düşecektir.</span>
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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Görevi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
