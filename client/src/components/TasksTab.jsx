import React, { useState } from 'react';
import { 
  Plus, CheckCircle2, Clock, AlertTriangle, User, 
  Trash2, Play, RotateCcw, Calendar, Check, Filter
} from 'lucide-react';

export default function TasksTab({ tasks, currentUser, onUpdateStatus, onDeleteTask, onOpenNewModal }) {
  const [filter, setFilter] = useState('active'); // 'active', 'all', 'completed', 'mine'

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'mine') return t.assigned_to === currentUser || t.assigned_to === 'Hepsi';
    return true;
  });

  const activeCount = tasks.filter(t => t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const priorityBadge = (p) => {
    switch (p) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            Acil
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
            Normal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-700">
            Düşük
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top action bar: Add button & count summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            📋 İş Takibi & Vardiya Devri
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeCount} bekleyen/yapılan iş, {completedCount} tamamlanan
          </p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/25 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni İş / Vardiya Notu
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'active'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Bekleyenler ({activeCount})
        </button>
        <button
          onClick={() => setFilter('mine')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'mine'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Bana Ait ({tasks.filter(t => t.assigned_to === currentUser && t.status !== 'completed').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Tamamlananlar ({completedCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'all'
              ? 'bg-slate-700 text-white border border-slate-600'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Tümü ({tasks.length})
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Bu filtrede hiç görev yok!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Her şey yolunda görünüyor. Yeni bir vardiya devir işi veya görev eklemek için butona basabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`group rounded-2xl border transition-all duration-200 p-4 ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                    : isInProgress
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Header line of card */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {priorityBadge(task.priority)}

                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3 animate-spin" />
                        Yapılıyor
                      </span>
                    )}

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        Tamamlandı
                      </span>
                    )}

                    {task.due_date && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {task.due_date}
                      </span>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (confirm(`"${task.title}" görevini silmek istediğinize emin misiniz?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                    title="Görevi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Title and Description */}
                <h3 className={`text-sm font-bold leading-snug ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-300 mt-1.5 whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                )}

                {/* Card Footer: Metadata & Action buttons */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Assigned and Creator */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      Atanan: <strong className="text-slate-200">{task.assigned_to}</strong>
                    </span>
                    <span>•</span>
                    <span>Ekleyen: <strong className="text-slate-300">{task.created_by}</strong></span>

                    {isCompleted && task.completed_by && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">
                          ✓ {task.completed_by} bitirdi
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {!isCompleted && !isInProgress && (
                      <button
                        onClick={() => onUpdateStatus(task.id, 'in_progress')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition active:scale-95"
                      >
                        <Play className="w-3 h-3" />
                        İşe Başla
                      </button>
                    )}

                    {!isCompleted && (
                      <button
                        onClick={() => onUpdateStatus(task.id, 'completed')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Tamamla
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        onClick={() => onUpdateStatus(task.id, 'pending')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Geri Aç
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
