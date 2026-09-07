import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import TasksTab from './components/TasksTab';
import RulesTab from './components/RulesTab';
import LogsTab from './components/LogsTab';
import SapDrawerModal from './components/SapDrawerModal';
import TaskDetailModal from './components/TaskDetailModal';
import NewTaskModal from './components/NewTaskModal';
import NewRuleModal from './components/NewRuleModal';
import NewSapModal from './components/NewSapModal';
import { socket } from './socket';
import { 
  requestNotificationPermission, 
  sendBrowserNotification 
} from './utils/notifications';
import { LayoutDashboard, CheckSquare, BookOpen, ClipboardList, Bell } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('depo_user') || 'Erkan';
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'tasks', 'rules', 'logs'
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

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
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isSapModalOpen, setIsSapModalOpen] = useState(false);
  const [isSapDrawerOpen, setIsSapDrawerOpen] = useState(false);

  // Show in-app banner
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleRequestNotification = async () => {
    const res = await requestNotificationPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      sendBrowserNotification('Teknik Depo Bildirimleri Açık! 🔔', 'Yeni iş ve güncellemeler anında telefonunuza gelecektir.');
      showToast('Bildirimler başarıyla açıldı!');
    } else {
      showToast('Bildirim izni verilmedi veya desteklenmiyor.');
    }
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
        const title = task.status === 'completed'
          ? `✓ ${by} görevi tamamladı!`
          : `${by} görevi güncelledi`;
        const body = `"${task.title}"`;
        sendBrowserNotification(title, body);
        showToast(`${title}: ${body}`);
      }
    }

    function onTaskCreated({ task, by }) {
      if (by !== currentUser) {
        const title = `📋 Yeni İş Eklendi (${by})`;
        const body = `"${task.title}" (Kime: ${task.assigned_to})`;
        sendBrowserNotification(title, body);
        showToast(`${title}: ${body}`);
      }
    }

    function onRuleCreated({ rule, by }) {
      if (by !== currentUser) {
        const title = `💡 Yeni Depo Kuralı (${by})`;
        const body = `"${rule.title}"`;
        sendBrowserNotification(title, body);
        showToast(`${title}: ${body}`);
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
    showToast(`Vardiya: ${name}`);
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
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 border border-sky-500/60 text-white px-4 py-2 rounded-2xl shadow-2xl backdrop-blur flex items-center gap-2 text-xs animate-bounce">
          <Bell className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <Header
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        isConnected={isConnected}
        notificationPermission={notificationPermission}
        onRequestNotification={handleRequestNotification}
        onOpenSapDrawer={() => setIsSapDrawerOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-3 sm:p-4 pb-24">
        {/* Tab 1: Pano (Vardiya Devir & Takip Panosu) */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            tasks={tasks}
            rules={rules}
            currentUser={currentUser}
            onSelectTask={(task) => setSelectedTaskForModal(task)}
            onUpdateStatus={handleUpdateTaskStatus}
            onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
            onSwitchTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab 2: Kompakt İş Listesi */}
        {activeTab === 'tasks' && (
          <TasksTab
            tasks={tasks}
            currentUser={currentUser}
            onSelectTask={(task) => setSelectedTaskForModal(task)}
            onUpdateStatus={handleUpdateTaskStatus}
            onOpenNewModal={() => setIsTaskModalOpen(true)}
          />
        )}

        {/* Tab 3: Kurallar & Depo Notları */}
        {activeTab === 'rules' && (
          <RulesTab
            rules={rules}
            onDeleteRule={handleDeleteRule}
            onOpenNewModal={() => setIsRuleModalOpen(true)}
          />
        )}

        {/* Tab 4: Vardiya Olay Günlüğü */}
        {activeTab === 'logs' && (
          <LogsTab
            logs={logs}
            currentUser={currentUser}
            onAddLog={handleAddLog}
          />
        )}
      </main>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-3 py-1.5 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* 1. PANO */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'text-sky-400 font-bold bg-sky-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-1 font-medium">Pano</span>
          </button>

          {/* 2. İŞLER */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
              activeTab === 'tasks'
                ? 'text-sky-400 font-bold bg-sky-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <CheckSquare className="w-4 h-4" />
              {activeTaskCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-slate-900">
                  {activeTaskCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">İşler</span>
          </button>

          {/* 3. KURALLAR */}
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'rules'
                ? 'text-amber-400 font-bold bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] mt-1 font-medium">Kurallar</span>
          </button>

          {/* 4. GÜNLÜK */}
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'logs'
                ? 'text-indigo-400 font-bold bg-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="text-[10px] mt-1 font-medium">Günlük</span>
          </button>
        </div>
      </nav>

      {/* Task Detail Pop-up Modal */}
      <TaskDetailModal
        task={selectedTaskForModal}
        isOpen={Boolean(selectedTaskForModal)}
        onClose={() => setSelectedTaskForModal(null)}
        currentUser={currentUser}
        onUpdateStatus={handleUpdateTaskStatus}
        onDeleteTask={handleDeleteTask}
      />

      {/* SAP Drawer / Pop-up */}
      <SapDrawerModal
        isOpen={isSapDrawerOpen}
        onClose={() => setIsSapDrawerOpen(false)}
        sapGuides={sapGuides}
        onDeleteSap={handleDeleteSap}
        onOpenNewModal={() => {
          setIsSapDrawerOpen(false);
          setIsSapModalOpen(true);
        }}
      />

      {/* New Item Modals */}
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
