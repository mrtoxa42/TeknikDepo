import React from 'react';
import { X, Check, Clock, User, Calendar, Trash2, AlertTriangle, Play, RotateCcw } from 'lucide-react';

export default function TaskDetailModal({ task, isOpen, onClose, currentUser, onUpdateStatus, onDeleteTask }) {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            {task.priority === 'urgent' && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <AlertTriangle className="w-3 h-3" /> Acil İş
              </span>
            )}
            {task.priority === 'normal' && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Normal İş
              </span>
            )}
            {task.priority === 'low' && (
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Düşük Öncelik
              </span>
            )}

            {isInProgress && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Clock className="w-3 h-3 animate-spin" /> Yapılıyor
              </span>
            )}
            {isCompleted && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Check className="w-3 h-3" /> Tamamlandı
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <h2 className={`text-base font-bold leading-snug ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
              {task.title}
            </h2>
            {task.description ? (
              <p className="text-xs text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {task.description}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic mt-2">Detaylı açıklama girilmemiş.</p>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-500 block mb-0.5 flex items-center gap-1">
                <User className="w-3 h-3" /> Kime Atandı
              </span>
              <strong className="text-slate-200">{task.assigned_to}</strong>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-500 block mb-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Zaman / Vade
              </span>
              <strong className="text-slate-200">{task.due_date || 'Belirtilmedi'}</strong>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 pt-1">
            <div>Ekleyen: <strong className="text-slate-300">{task.created_by}</strong> ({new Date(task.created_at).toLocaleString('tr-TR')})</div>
            {isCompleted && task.completed_by && (
              <div className="text-emerald-400 font-medium">
                ✓ {task.completed_by} tarafından tamamlandı.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition"
            title="Görevi Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {!isCompleted && !isInProgress && (
              <button
                onClick={() => {
                  onUpdateStatus(task.id, 'in_progress');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition"
              >
                <Play className="w-3.5 h-3.5" /> İşe Başla
              </button>
            )}

            {!isCompleted && (
              <button
                onClick={() => {
                  onUpdateStatus(task.id, 'completed');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition"
              >
                <Check className="w-4 h-4" /> Görevi Tamamla
              </button>
            )}

            {isCompleted && (
              <button
                onClick={() => {
                  onUpdateStatus(task.id, 'pending');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Tekrar Aç
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
