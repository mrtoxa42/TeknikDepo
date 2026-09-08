import React, { useState, useRef } from 'react';
import { X, Plus, Pin, CheckSquare, Clock, Mic, MicOff, Camera, Image, Trash2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { startVoiceRecognition } from '../utils/speechRecognition';

export default function NewCardModal({ isOpen, onClose, onAddCard, currentUser, initialCol = 'notes' }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [boardCol, setBoardCol] = useState(initialCol);
  const [color, setColor] = useState('amber');
  const [image, setImage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'amber', label: 'Sarı', bg: 'bg-amber-500' },
    { id: 'blue', label: 'Mavi', bg: 'bg-blue-500' },
    { id: 'rose', label: 'Kırmızı', bg: 'bg-rose-500' },
    { id: 'emerald', label: 'Yeşil', bg: 'bg-emerald-500' },
    { id: 'purple', label: 'Mor', bg: 'bg-purple-500' }
  ];

  // Voice recording toggle
  const handleToggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const rec = startVoiceRecognition({
        onResult: (text) => {
          setContent((prev) => (prev ? `${prev} ${text}` : text));
          setIsRecording(false);
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false)
      });
      recognitionRef.current = rec;
    }
  };

  // Photo selection & compression
  const handlePhotoSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 900, 0.7);
      setImage(compressed);
    } catch (err) {
      console.error('Fotoğraf yüklenemedi:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddCard({
      board_col: boardCol,
      title: title.trim(),
      content: content.trim(),
      image,
      color,
      created_by: currentUser
    });

    setTitle('');
    setContent('');
    setImage('');
    setIsRecording(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Yeni Not / İş Ekle</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          {/* Sütun Seçimi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
              Notun Türü:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBoardCol('notes')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  boardCol === 'notes'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                <span>📌 Kalıcı Not</span>
              </button>

              <button
                type="button"
                onClick={() => setBoardCol('todo')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  boardCol === 'todo'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>⏳ Yapılacak</span>
              </button>

              <button
                type="button"
                onClick={() => setBoardCol('doing')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  boardCol === 'doing'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 ring-1 ring-purple-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>⚡ İşlemde</span>
              </button>
            </div>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Başlık / Malzeme / Hatırlatma <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: 4120 Kodlu Kimyasal veya İrsaliye Kesildi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              autoFocus
            />
          </div>

          {/* Not / Açıklama + Ses Butonu */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Detaylı Not
              </label>

              {/* Sesle Yazdırma (Mikrofon) Butonu */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/40'
                    : 'bg-slate-800 text-sky-400 hover:bg-slate-750'
                }`}
                title="Sesle Yazdır"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Dinliyor...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Sesle Yaz</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Örn: Rafta 1 adet fazla var, raf stok dışı görünmesin diye üzerine yazılmadı..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
            />
          </div>

          {/* Fotoğraf Ekleme Alanı */}
          <div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {!image ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 border border-dashed border-slate-700 hover:border-sky-500 rounded-xl text-xs font-semibold text-slate-400 hover:text-sky-400 flex items-center justify-center gap-2 bg-slate-950/40 transition"
              >
                <Camera className="w-4 h-4" />
                <span>📷 Fotoğraf Çek / Ekle</span>
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-36 bg-black flex items-center justify-center">
                <img src={image} alt="Yüklenen görsel" className="max-h-36 object-contain" />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-lg"
                  title="Fotoğrafı Kaldır"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Renk Seçimi */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-semibold">Renk:</span>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-6 h-6 rounded-full ${c.bg} transition-all ${
                    color === c.id ? 'ring-2 ring-white scale-110' : 'opacity-50'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Panoya Yapıştır
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
