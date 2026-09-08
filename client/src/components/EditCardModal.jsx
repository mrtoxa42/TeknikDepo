import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Camera, Mic, MicOff, Image, Trash } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { startVoiceRecognition } from '../utils/speechRecognition';

export default function EditCardModal({ card, isOpen, onClose, onUpdateCard, onMoveCard, onDeleteCard, currentUser }) {
  if (!isOpen || !card) return null;

  const [title, setTitle] = useState(card.title);
  const [content, setContent] = useState(card.content || '');
  const [image, setImage] = useState(card.image || '');
  const [color, setColor] = useState(card.color || 'amber');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTitle(card.title);
    setContent(card.content || '');
    setImage(card.image || '');
    setColor(card.color || 'amber');
    setIsRecording(false);
  }, [card]);

  const colorOptions = [
    { id: 'amber', bg: 'bg-amber-500' },
    { id: 'blue', bg: 'bg-blue-500' },
    { id: 'rose', bg: 'bg-rose-500' },
    { id: 'emerald', bg: 'bg-emerald-500' },
    { id: 'purple', bg: 'bg-purple-500' }
  ];

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

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateCard(card.id, {
      title: title.trim(),
      content: content.trim(),
      image,
      color
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <span className="text-xs font-bold text-white">Kartı Düzenle / Taşı</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          {/* Quick Column Move Buttons */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Panodaki Yeri:
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <button
                type="button"
                onClick={() => { onMoveCard(card.id, 'notes'); onClose(); }}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition ${
                  card.board_col === 'notes' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                📌 Kalıcı Not
              </button>

              <button
                type="button"
                onClick={() => { onMoveCard(card.id, 'todo'); onClose(); }}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition ${
                  card.board_col === 'todo' ? 'bg-sky-500/20 border-sky-500 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ⏳ Yapılacak
              </button>

              <button
                type="button"
                onClick={() => { onMoveCard(card.id, 'doing'); onClose(); }}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition ${
                  card.board_col === 'doing' ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ⚡ İşlemde
              </button>

              <button
                type="button"
                onClick={() => { onMoveCard(card.id, 'done'); onClose(); }}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition ${
                  card.board_col === 'done' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ✓ Bitti
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Başlık</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Not + Voice */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Açıklama / Not</label>
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-sky-400 hover:bg-slate-750'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Dinliyor...' : 'Sesle Yaz'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* Photo */}
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
                className="w-full py-2 px-3 border border-dashed border-slate-700 hover:border-sky-500 rounded-xl text-xs font-semibold text-slate-400 hover:text-sky-400 flex items-center justify-center gap-1.5 bg-slate-950/40"
              >
                <Camera className="w-4 h-4" />
                <span>📷 Fotoğraf Ekle</span>
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-36 bg-black flex items-center justify-center">
                <img src={image} alt="Kart görseli" className="max-h-36 object-contain" />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow"
                  title="Fotoğrafı Kaldır"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Color */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-6 h-6 rounded-full ${c.bg} transition-all ${
                    color === c.id ? 'ring-2 ring-white scale-110' : 'opacity-50'
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] text-slate-500">
              Yazan: {card.created_by}
            </span>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Bu kartı silmek istediğinize emin misiniz?')) {
                  onDeleteCard(card.id);
                  onClose();
                }
              }}
              className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition"
              title="Kartı Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
