import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TasksTab from './components/TasksTab';
import RulesTab from './components/RulesTab';
import SapTab from './components/SapTab';
import LogsTab from './components/LogsTab';
import NewTaskModal from './components/NewTaskModal';
import NewRuleModal from './components/NewRuleModal';
import NewSapModal from './components/NewSapModal';
import { socket } from './socket';
import { CheckSquare, BookOpen, Terminal, ClipboardList, Bell } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('depo_user') || 'Erkan';
  });

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'rules', 'sap', 'logs'
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [users, setUsers] = useState([
    { id: 1, name: 'Erkan', role: 'Teknik Depo' },
    { id: 2, name: 'Berkay', role: 'Teknik Depo' },
    { id: 3, name: 'Emircan', role: 'Teknik Depo' }
  ]);

  const [tasks, setTasks] = useState([]);
  const [rules, setRules] = useState([]);
  const [sapGuides, setSapGuides] = useState([]);
  const [logs, setLogs] = useState([]);
  const [toast, setToast] = useState(null);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isSapModalOpen, setIsSapModalOpen] = useState(false);

  // Show quick toast
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load initial data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/init');
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length) setUsers(data.users);
        if (data.tasks) setTasks(data.tasks);
        if (data.rules) setRules(data.rules);
        if (data.sapGuides) setSapGuides(data.sapGuides);
        if (data.logs) setLogs(data.logs);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Socket events
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onTasksUpdated(updatedTasks) {
      setTasks(updatedTasks);
    }

    function onRulesUpdated(updatedRules) {
      setRules(updatedRules);
    }

    function onSapUpdated(updatedSap) {
      setSapGuides(updatedSap);
    }

    function onLogsUpdated(updatedLogs) {
      setLogs(updatedLogs);
    }

    function onTaskStatusChanged({ task, by }) {
      if (by !== currentUser) {
        showToast(`${by}, "${task.title}" görevini güncelledi.`);
      }
    }

    function onTaskCreated({ task, by }) {
      if (by !== currentUser) {
        showToast(`${by} yeni iş ekledi: "${task.title}"`);
      }
    }

    function onRuleCreated({ rule, by }) {
      if (by !== currentUser) {
        showToast(`${by} yeni kural ekledi: "${rule.title}"`);
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('tasks_updated', onTasksUpdated);
    socket.on('rules_updated', onRulesUpdated);
    socket.on('sap_updated', onSapUpdated);
    socket.on('logs_updated', onLogsUpdated);
    socket.on('task_status_changed', onTaskStatusChanged);
    socket.on('task_created', onTaskCreated);
    socket.on('rule_created', onRuleCreated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('tasks_updated', onTasksUpdated);
      socket.off('rules_updated', onRulesUpdated);
      socket.off('sap_updated', onSapUpdated);
      socket.off('logs_updated', onLogsUpdated);
      socket.off('task_status_changed', onTaskStatusChanged);
      socket.off('task_created', onTaskCreated);
      socket.off('rule_created', onRuleCreated);
    };
  }, [currentUser]);

  const handleSelectUser = (name) => {
    setCurrentUser(name);
    localStorage.setItem('depo_user', name);
    showToast(`Aktif Kullanıcı: ${name}`);
  };

  // API Actions
  const handleAddTask = async (taskData) => {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, user: currentUser })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRule = async (ruleData) => {
    try {
      await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await fetch(`/api/rules/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSap = async (sapData) => {
    try {
      await fetch('/api/sap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sapData)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSap = async (id) => {
    try {
      await fetch(`/api/sap/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLog = async (logData) => {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const activeTaskCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 border border-sky-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur flex items-center gap-2.5 text-xs animate-bounce">
          <Bell className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <Header
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        isConnected={isConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 pb-24">
        {activeTab === 'tasks' && (
          <TasksTab
            tasks={tasks}
            currentUser={currentUser}
            onUpdateStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            onOpenNewModal={() => setIsTaskModalOpen(true)}
          />
        )}

        {activeTab === 'rules' && (
          <RulesTab
            rules={rules}
            onDeleteRule={handleDeleteRule}
            onOpenNewModal={() => setIsRuleModalOpen(true)}
          />
        )}

        {activeTab === 'sap' && (
          <SapTab
            sapGuides={sapGuides}
            onDeleteSap={handleDeleteSap}
            onOpenNewModal={() => setIsSapModalOpen(true)}
          />
        )}

        {activeTab === 'logs' && (
          <LogsTab
            logs={logs}
            currentUser={currentUser}
            onAddLog={handleAddLog}
          />
        )}
      </main>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-3 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* Tab 1: Tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
              activeTab === 'tasks'
                ? 'text-sky-400 font-bold bg-sky-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <CheckSquare className="w-5 h-5" />
              {activeTaskCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {activeTaskCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">İşler</span>
          </button>

          {/* Tab 2: Rules */}
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'rules'
                ? 'text-amber-400 font-bold bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Kurallar</span>
          </button>

          {/* Tab 3: SAP */}
          <button
            onClick={() => setActiveTab('sap')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'sap'
                ? 'text-emerald-400 font-bold bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">SAP</span>
          </button>

          {/* Tab 4: Logs */}
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'logs'
                ? 'text-indigo-400 font-bold bg-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Günlük</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
        currentUser={currentUser}
        users={users}
      />

      <NewRuleModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        onAddRule={handleAddRule}
        currentUser={currentUser}
      />

      <NewSapModal
        isOpen={isSapModalOpen}
        onClose={() => setIsSapModalOpen(false)}
        onAddSap={handleAddSap}
        currentUser={currentUser}
      />
    </div>
  );
}
