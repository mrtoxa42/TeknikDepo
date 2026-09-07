import React, { useState, useEffect } from 'react';
import NewCardModal from './components/NewCardModal';
import EditCardModal from './components/EditCardModal';
import { socket } from './socket';
import { requestNotificationPermission, sendBrowserNotification } from './utils/notifications';
import { 
  Plus, Pin, CheckSquare, Clock, CheckCircle2, 
  Bell, BellRing, User, LayoutGrid, Search, Trash2, ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('depo_user') || 'Erkan';
  });

  const [cards, setCards] = useState([]);
  const [activeCol, setActiveCol] = useState('all'); // 'all', 'notes', 'todo', 'doing', 'done'
  const [search, setSearch] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newModalDefaultCol, setNewModalDefaultCol] = useState('notes');
  const [selectedCardForEdit, setSelectedCardForEdit] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const users = ['Erkan', 'Berkay', 'Emircan'];

  const userColors = {
    Erkan: 'from-emerald-600 to-emerald-700',
    Berkay: 'from-blue-600 to-blue-700',
    Emircan: 'from-amber-600 to-amber-700'
  };

  const cardBorderColors = {
    amber: 'border-l-amber-500 text-amber-300',
    blue: 'border-l-blue-500 text-blue-300',
    rose: 'border-l-rose-500 text-rose-300',
    emerald: 'border-l-emerald-500 text-emerald-300',
    purple: 'border-l-purple-500 text-purple-300'
  };

  // Fetch cards
  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCards();

    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onCardsUpdated(updatedCards) {
      setCards(updatedCards);
    }
    function onCardCreated({ card, by }) {
      if (by !== currentUser) {
        const title = `📌 Yeni Not / Kart (${by})`;
        sendBrowserNotification(title, card.title);
        showToast(`${title}: ${card.title}`);
      }
    }
    function onCardMoved({ card, by, to }) {
      if (by !== currentUser) {
        const colNames = { notes: 'Depo Notları', todo: 'Yapılacak', doing: 'İşlemde', done: 'Bitti' };
        const title = `🔄 Kart Taşındı (${by})`;
        const body = `"${card.title}" -> ${colNames[to] || to}`;
        sendBrowserNotification(title, body);
        showToast(`${title}: ${body}`);
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('cards_updated', onCardsUpdated);
    socket.on('card_created', onCardCreated);
    socket.on('card_moved', onCardMoved);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('cards_updated', onCardsUpdated);
      socket.off('card_created', onCardCreated);
      socket.off('card_moved', onCardMoved);
    };
  }, [currentUser]);

  const handleSelectUser = (u) => {
    setCurrentUser(u);
    localStorage.setItem('depo_user', u);
    showToast(`Aktif Kullanıcı: ${u}`);
  };

  const handleRequestNotification = async () => {
    const res = await requestNotificationPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      sendBrowserNotification('Bildirimler Aktif!', 'Yeni notlar ve güncellemeler anında telefonunuza gelecek.');
      showToast('Bildirimler başarıyla açıldı!');
    } else {
      showToast('Bildirim izni verilmedi.');
    }
  };

  // API Actions
  const handleAddCard = async (data) => {
    try {
      await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveCard = async (id, col) => {
    try {
      await fetch(`/api/cards/${id}/col`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_col: col, user: currentUser })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCard = async (id, data) => {
    try {
      await fetch(`/api/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await fetch(`/api/cards/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  // Column counts
  const notesCards = cards.filter((c) => c.board_col === 'notes');
  const todoCards = cards.filter((c) => c.board_col === 'todo');
  const doingCards = cards.filter((c) => c.board_col === 'doing');
  const doneCards = cards.filter((c) => c.board_col === 'done');

  // Filtered by search
  const filterList = (list) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((c) => c.title.toLowerCase().includes(q) || (c.content && c.content.toLowerCase().includes(q)));
  };

  const columns = [
    {
      id: 'notes',
      title: 'Depo Notları & Hatırlatma',
      icon: Pin,
      colorText: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      cards: filterList(notesCards)
    },
    {
      id: 'todo',
      title: 'Yapılacaklar',
      icon: CheckSquare,
      colorText: 'text-sky-400',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      cards: filterList(todoCards)
    },
    {
      id: 'doing',
      title: 'İşlemde / Yapılıyor',
      icon: Clock,
      colorText: 'text-purple-400',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      cards: filterList(doingCards)
    },
    {
      id: 'done',
      title: 'Tamamlananlar',
      icon: CheckCircle2,
      colorText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      cards: filterList(doneCards)
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-sky-500/60 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <Bell className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-3 py-2.5 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col gap-2.5">
          {/* Row 1: Title & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-white flex items-center gap-1.5">
                🏭 TEKNİK DEPO PANOSU
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification button */}
              <button
                onClick={handleRequestNotification}
                className={`p-2 rounded-xl border transition active:scale-95 ${
                  notificationPermission === 'granted'
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                }`}
                title={notificationPermission === 'granted' ? 'Bildirimler Açık' : 'Bildirimleri Aç'}
              >
                {notificationPermission === 'granted' ? (
                  <Bell className="w-4 h-4 text-emerald-400" />
                ) : (
                  <BellRing className="w-4 h-4 text-amber-400" />
                )}
              </button>

              {/* Big Add Button */}
              <button
                onClick={() => {
                  setNewModalDefaultCol(activeCol === 'all' ? 'notes' : activeCol);
                  setIsNewModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/30 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Not / İş</span>
              </button>
            </div>
          </div>

          {/* Row 2: User Switcher (Erkan, Berkay, Emircan) */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center justify-between gap-1">
            <span className="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1 shrink-0">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Yazan:
            </span>
            <div className="flex items-center gap-1 flex-1 justify-end">
              {users.map((u) => {
                const isSelected = currentUser === u;
                return (
                  <button
                    key={u}
                    onClick={() => handleSelectUser(u)}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition ${
                      isSelected
                        ? `bg-gradient-to-r ${userColors[u]} text-white shadow-md ring-1 ring-white/30 scale-[1.02]`
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* SUB-HEADER: COLUMN FILTER TABS & SEARCH */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-3 py-2 sticky top-[87px] z-30 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveCol('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCol === 'all'
                ? 'bg-slate-700 text-white border border-slate-600 shadow'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Tüm Pano ({cards.length})
          </button>

          <button
            onClick={() => setActiveCol('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCol === 'notes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-amber-400" />
            Depo Notları ({notesCards.length})
          </button>

          <button
            onClick={() => setActiveCol('todo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCol === 'todo'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
            Yapılacak ({todoCards.length})
          </button>

          <button
            onClick={() => setActiveCol('doing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCol === 'doing'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            İşlemde ({doingCards.length})
          </button>

          <button
            onClick={() => setActiveCol('done')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCol === 'done'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Bitti ({doneCards.length})
          </button>
        </div>
      </div>

      {/* MAIN BOARD CONTENT */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-4">
        {/* Render columns based on selection */}
        {activeCol === 'all' ? (
          // ALL COLUMNS (TRELLO GRID)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {columns.map((col) => (
              <div key={col.id} className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3 flex flex-col h-fit">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <col.icon className={`w-4 h-4 ${col.colorText}`} />
                    <span className="text-xs font-bold text-white">{col.title}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full border ${col.badgeBg}`}>
                    {col.cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5">
                  {col.cards.length === 0 ? (
                    <div className="text-center py-6 text-slate-600 text-xs italic">
                      Henüz not yok
                    </div>
                  ) : (
                    col.cards.map((card) => renderCard(card))
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // SINGLE COLUMN FULL LIST
          <div>
            {columns
              .filter((col) => col.id === activeCol)
              .map((col) => (
                <div key={col.id} className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <col.icon className={`w-5 h-5 ${col.colorText}`} />
                      <h2 className="text-sm font-bold text-white">{col.title}</h2>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${col.badgeBg}`}>
                      {col.cards.length} kayıt
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {col.cards.length === 0 ? (
                      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                        Bu bölümde henüz kart bulunmuyor.
                      </div>
                    ) : (
                      col.cards.map((card) => renderCard(card))
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* RENDER A SINGLE CARD HELPER */}
      {function renderCard(card) {
        const borderClass = cardBorderColors[card.color] || cardBorderColors.amber;
        const isDone = card.board_col === 'done';

        return (
          <div
            key={card.id}
            onClick={() => setSelectedCardForEdit(card)}
            className={`bg-slate-900 hover:bg-slate-850 border border-slate-800/90 rounded-xl p-3 shadow-md border-l-4 ${borderClass} transition cursor-pointer hover:border-slate-700 active:scale-[0.99]`}
          >
            {/* Title */}
            <div className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
              {card.title}
            </div>

            {/* Content Note */}
            {card.content && (
              <p className="text-[11px] text-slate-300 mt-1.5 whitespace-pre-wrap leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                {card.content}
              </p>
            )}

            {/* Card Footer: Author + Quick Move Buttons */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">
                Yazan: <strong className="text-slate-200">{card.created_by}</strong>
                {card.completed_by && isDone && (
                  <span className="text-emerald-400 font-semibold"> (✓ {card.completed_by})</span>
                )}
              </span>

              {/* Quick Move Action Pills */}
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {card.board_col === 'notes' && (
                  <button
                    onClick={() => handleMoveCard(card.id, 'todo')}
                    className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 hover:bg-sky-900 font-semibold"
                    title="Yapılacaklar listesine aktar"
                  >
                    → Yapılacak
                  </button>
                )}

                {card.board_col === 'todo' && (
                  <button
                    onClick={() => handleMoveCard(card.id, 'doing')}
                    className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/60 hover:bg-purple-900 font-semibold"
                    title="İşlemde olarak işaretle"
                  >
                    → İşlemde
                  </button>
                )}

                {card.board_col !== 'done' && (
                  <button
                    onClick={() => handleMoveCard(card.id, 'done')}
                    className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900 font-semibold"
                    title="Tamamlandı olarak işaretle"
                  >
                    ✓ Bitti
                  </button>
                )}

                {card.board_col === 'done' && (
                  <button
                    onClick={() => handleMoveCard(card.id, 'todo')}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 font-medium"
                    title="Tekrar Yapılacaklar listesine al"
                  >
                    ↩ Geri Al
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }}

      {/* MODALS */}
      <NewCardModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddCard={handleAddCard}
        currentUser={currentUser}
        initialCol={newModalDefaultCol}
      />

      <EditCardModal
        card={selectedCardForEdit}
        isOpen={Boolean(selectedCardForEdit)}
        onClose={() => setSelectedCardForEdit(null)}
        onUpdateCard={handleUpdateCard}
        onMoveCard={handleMoveCard}
        onDeleteCard={handleDeleteCard}
        currentUser={currentUser}
      />
    </div>
  );
}
