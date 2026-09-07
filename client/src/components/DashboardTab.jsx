import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, Calendar, 
  ChevronRight, Plus, Check, BookOpen, ArrowRight, User
} from 'lucide-react';

export default function DashboardTab({ 
  tasks, 
  rules, 
  currentUser, 
  onSelectTask, 
  onUpdateStatus, 
  onOpenNewTaskModal,
  onSwitchTab
}) {
  // Tasks for current user or urgent pending
  const myTasks = tasks.filter(
    (t) => t.status !== 'completed' && (t.assigned_to === currentUser || t.assigned_to === 'Hepsi')
  );

  // Recently completed tasks (last 5)
  const completedTasks = tasks
    .filter((t) => t.status === 'completed')
    .slice(0, 5);

  // Future / upcoming pending tasks
  const otherPendingTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.assigned_to !== currentUser && t.assigned_to !== 'Hepsi'
  );

  // Top critical rule (e.g. Badem sac)
  const criticalRules = rules.filter((r) => r.importance === 'critical').slice(0, 2);

  return (
    <div className="space-y-4 pb-12">
      {/* Welcome & Quick Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Vardiya Panosu
          </div>
          <h2 className="text-base font-bold text-white mt-0.5">
            Merhaba, {currentUser} 👋
          </h2>
          <p className="text-xs text-slate-400">
            {myTasks.length > 0
              ? `Vardiyanda ilgilenmen gereken ${myTasks.length} iş var.`
              : 'Harika! Vardiyanda bekleyen iş kalmadı.'}
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/30 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Hızlı Not / İş Ekle</span>
          <span className="sm:hidden">İş Ekle</span>
        </button>
      </div>

      {/* SECTION 1: 🎯 BENİM VARDİYAMA KALANLAR */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            🎯 Vardiyanda Yapılacaklar ({myTasks.length})
          </h3>
          <button
            onClick={() => onSwitchTab('tasks')}
            className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-0.5"
          >
            Tüm Liste <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {myTasks.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs text-slate-300 font-semibold">Sana atanan bekleyen iş yok</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Yeni bir not veya iş ekleyebilirsin.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(task.id, 'completed');
                    }}
                    className="w-5 h-5 rounded-lg border border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center text-transparent hover:text-emerald-400 shrink-0 transition"
                    title="Tamamlandı Olarak İşaretle"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {task.title}
                      </span>
                      {task.priority === 'urgent' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Acil
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Kime: <strong className="text-slate-300">{task.assigned_to}</strong></span>
                      {task.due_date && <span>• {task.due_date}</span>}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: 🕒 GEÇEN VARDİYADA NELER YAPILDI? (Devir Teslim Özeti) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            🕒 Geçen Vardiyada Neler Bitti? (Devir Teslim)
          </h3>
          <span className="text-[11px] text-slate-500">Son Tamamlananlar</span>
        </div>

        {completedTasks.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-3">Henüz tamamlanan bir iş kaydı yok.</p>
        ) : (
          <div className="space-y-1.5">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:bg-slate-800/50 transition cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">
                    {task.title}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 shrink-0">
                  ✓ {task.completed_by || 'Biri'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: 📅 İLERİKİ İŞLER & DİĞER BEKLEYENLER */}
      {otherPendingTasks.length > 0 && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              📅 İleride Yapılacak / Diğer İşler ({otherPendingTasks.length})
            </h3>
          </div>
          <div className="space-y-1.5">
            {otherPendingTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:bg-slate-800/50 transition cursor-pointer text-xs"
              >
                <span className="text-slate-300 truncate">{task.title}</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                  {task.assigned_to}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: 📌 KRİTİK DEPO PANOSU (Badem Sac vb. Püf Noktaları) */}
      <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 rounded-2xl border border-amber-600/30 p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            📌 Kritik Depo Kural Panosu
          </h3>
          <button
            onClick={() => onSwitchTab('rules')}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
          >
            Tüm Kurallar <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2 mt-2">
          {criticalRules.map((rule) => (
            <div key={rule.id} className="bg-slate-950/70 p-3 rounded-xl border border-amber-700/30">
              <div className="text-xs font-bold text-amber-200">{rule.title}</div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{rule.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
