import React, { useState } from 'react';
import { X, Plus, Terminal } from 'lucide-react';

export default function NewSapModal({ isOpen, onClose, onAddSap, currentUser }) {
  const [tcode, setTcode] = useState('MIGO');
  const [title, setTitle] = useState('');
  const [movementType, setMovementType] = useState('');
  const [steps, setSteps] = useState('');
  const [tips, setTips] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tcode.trim() || !title.trim() || !steps.trim()) return;

    onAddSap({
      tcode: tcode.trim().toUpperCase(),
      title: title.trim(),
      movement_type: movementType.trim(),
      steps: steps.trim(),
      tips: tips.trim(),
      created_by: currentUser
    });

    setTitle('');
    setMovementType('');
    setSteps('');
    setTips('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Yeni SAP İşlem Rehberi Ekle</h2>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                SAP İşlem Kodu (T-Code) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Örn: MIGO, MB1B, MB52"
                value={tcode}
                onChange={(e) => setTcode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono uppercase text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hareket Türü (Varsa)
              </label>
              <input
                type="text"
                placeholder="Örn: 311, 201, 101"
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              İşlem Tanımı / Başlık <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Depolar Arası Transfer Çıkışı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Adım Adım Yapılışı <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder={"1. MIGO ekranında Transfer Kaydı seçin.\n2. Hareket türüne 311 yazıp Enter'a basın.\n3. Malzeme ve hedef depoyu girin..."}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-mono text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Önemli İpucu & Uyarı (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: Parti no girmeden kontrol et butonuna basmayın."
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Rehberi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
