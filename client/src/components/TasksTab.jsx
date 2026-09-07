import React, { useState } from 'react';
import { Plus, Check, Clock, AlertTriangle, Calendar, User, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function TasksTab({ tasks, currentUser, onSelectTask, onUpdateStatus, onOpenNewModal }) {
  const [filter, setFilter] = useState('active'); // 'active', 'mine', 'completed', 'all'

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return t.status !== 'completed';
    if (filter === 'mine') return (t.assigned_to === currentUser || t.assigned_to === 'Hepsi') && t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const activeCount = tasks.filter((t) => t.status !== 'completed').length;
  const mineCount = tasks.filter((t) => (t.assigned_to === currentUser || t.assigned_to === 'Hepsi') && t.status !== 'completed').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-3 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white">📋 İş & Görev Listesi</h2>
          <p className="text-xs text-slate-400">Detay ve işlem için göreve tıklayın</p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni İş
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'active'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          Bekleyenler ({activeCount})
        </button>

        <button
          onClick={() => setFilter('mine')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'mine'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          Bana Ait ({mineCount})
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          Bitenler ({completedCount})
        </button>

        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filter === 'all'
              ? 'bg-slate-700 text-white border border-slate-600'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          Tümü ({tasks.length})
        </button>
      </div>

      {/* Compact List */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="text-xs text-slate-300 font-medium">Bu listede görev bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition cursor-pointer ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-800/50 opacity-65'
                    : isInProgress
                    ? 'bg-slate-900 border-amber-500/40 hover:border-amber-500/70'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left check circle / action */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(task.id, isCompleted ? 'pending' : 'completed');
                    }}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                      isCompleted
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : isInProgress
                        ? 'border-amber-400 text-amber-400 hover:bg-emerald-500/20 hover:border-emerald-400'
                        : 'border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/20 text-transparent hover:text-emerald-400'
                    }`}
                    title={isCompleted ? 'Geri Aç' : 'Tamamla'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </span>

                      {task.priority === 'urgent' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Acil
                        </span>
                      )}

                      {isInProgress && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Yapılıyor
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Atanan: <strong className="text-slate-300">{task.assigned_to}</strong></span>
                      {task.due_date && <span>• {task.due_date}</span>}
                      {isCompleted && task.completed_by && (
                        <span className="text-emerald-400">• ✓ {task.completed_by}</span>
                      )}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
