import React, { useState, useEffect } from 'react';
import { 
  Send, Sparkles, Compass, Hotel, Plane, 
  ArrowRight, RefreshCw, CheckCircle2, X, AlertTriangle, ShieldCheck, Dog, Activity, Menu, Plus, MessageSquare
} from 'lucide-react';

const presetCards = [
  { 
    id: 1, 
    title: "Маршрут для зумеров", 
    subtitle: "Тбилиси • 4 дня • Инста-места", 
    tag: "В тренде 🔥", 
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 2, 
    title: "Чиловый пляж", 
    subtitle: "Анталья • Всё включено • Релакс", 
    tag: "Топ выбор", 
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 3, 
    title: "Евро-тур на минималках", 
    subtitle: "Стамбул • Кофе и вайб", 
    tag: "Хит недели", 
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 4, 
    title: "Горный перезагруз", 
    subtitle: "Алтай • Трекинг и баня", 
    tag: "Природа", 
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
  },
];

// Несколько вариантов отелей для сравнения
const hotelOptions = [
  {
    id: 'h1',
    name: 'Sunrise Garden Resort & Spa',
    stars: '5★',
    rating: '9.4',
    tags: 'Всё включено • Пляжная линия',
    price: 84500,
    reason: 'Идеальный подогреваемый бассейн для ребенка и высокий уровень сервиса.',
    risk: 'Трансфер из аэропорта займет около 45 минут.'
  },
  {
    id: 'h2',
    name: 'Blue Wave Boutique Hotel',
    stars: '4★',
    rating: '8.8',
    tags: 'Завтраки • Вторая линия • Уютно',
    price: 67600,
    reason: 'Отличный вариант сэкономить 20% без потери в комфорте.',
    risk: 'До пляжа идти 7 минут пешком.'
  },
  {
    id: 'h3',
    name: 'Grand Oceanic Deluxe',
    stars: '5★',
    rating: '9.7',
    tags: 'Ультра всё включено • VIP пляж',
    price: 112000,
    reason: 'Максимальный премиум-комфорт, собственный аквапарк.',
    risk: 'Высокая стоимость тура.'
  }
];

export default function App() {
  const [chats, setChats] = useState([
    { id: 1, title: 'Анталья • Семья 5★', date: 'Сегодня' },
    { id: 2, title: 'Тбилиси • Зумер-тур', date: 'Вчера' }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ostrovok_chat_history');
    return saved ? JSON.parse(saved) : [
      { sender: 'ai', text: 'Привет! Я AI-агент Островка. Расскажи, какой вайб поездки ты ищешь или куда хочешь отправиться?' }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false); // Детальная модалка метрик
  const [postActionNotice, setPostActionNotice] = useState('');

  const [selectedHotel, setSelectedHotel] = useState(hotelOptions[0]);
  const [tripPlan, setTripPlan] = useState({
    flight: 'Москва (VKO) ➔ Анталья (AYT)',
    flightDate: '15 ноя, 06:05',
    hasPet: false,
    synced: true
  });

  // Поддержка кнопки «Назад» на телефоне/планшете
  useEffect(() => {
    const handlePopState = () => {
      if (isChatOpen) {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      window.history.pushState({ chatOpen: true }, '');
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isChatOpen]);

  useEffect(() => {
    localStorage.setItem('ostrovok_chat_history', JSON.stringify(messages));
  }, [messages]);

  const openChatWithQuery = (queryText) => {
    setIsChatOpen(true);
    window.history.pushState({ chatOpen: true }, '');
    handleSend(queryText);
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    setIsChatOpen(true);
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      let aiResponse = '';
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes('дешевле') || lowerQuery.includes('бюджет')) {
        setSelectedHotel(hotelOptions[1]);
        aiResponse = 'Пересобрал вариант! Переключил на отель 4★ Blue Wave. Общая стоимость снизилась, состыковки сохранены.';
      } 
      else if (lowerQuery.includes('собака') || lowerQuery.includes('питомец')) {
        setTripPlan(prev => ({ ...prev, hasPet: true }));
        aiResponse = 'Добавил опцию Pet-Friendly. Подобрал отель, принимающий с животными, и включил билет для питомца.';
      }
      else {
        aiResponse = `Проанализировал запрос ("${query}"). Подобрал несколько вариантов отелей (доступны для сравнения справа), прямые перелеты и трансфер.`;
      }

      setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
      setLoading(false);
    }, 1100);
  };
return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0B132B] to-[#1C2541] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Левая выезжающая шторка истории */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex">
          <div className="w-80 bg-[#0B132B] border-r border-cyan-500/20 p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-900/40">
                <span className="font-extrabold text-sm text-cyan-300 tracking-wider">ИСТОРИЯ ДИАЛОГОВ</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={() => { setIsChatOpen(false); setIsSidebarOpen(false); }}
                className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Новый чат с агентом</span>
              </button>

              <div className="space-y-2 pt-2">
                {chats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => { setActiveChatId(chat.id); setIsChatOpen(true); setIsSidebarOpen(false); }}
                    className={`p-3 rounded-xl text-xs cursor-pointer flex items-center space-x-3 transition ${
                      activeChatId === chat.id ? 'bg-cyan-600/30 border border-cyan-400/50 text-white' : 'bg-slate-900/40 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold truncate">{chat.title}</div>
                      <div className="text-[10px] text-slate-400">{chat.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-cyan-900/40">
              Островок AI Travel v2.4 • Память активна
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* Шапка */}
      <header className="border-b border-cyan-900/30 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setIsChatOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">Островок</span>
              <span className="text-[10px] block text-cyan-400/80 font-semibold">AI Travel Agent</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowMetricsModal(true)}
            className="text-xs bg-slate-900/90 border border-cyan-500/40 hover:bg-slate-800 px-3 py-2 rounded-xl transition flex items-center space-x-1.5 text-cyan-300 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Метрики агента</span>
          </button>

          {isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-xs font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-xl transition text-slate-200 hidden sm:block"
            >
              На главную
            </button>
          )}
        </div>
      </header>

      {/* Основной контент */}
      {!isChatOpen ? (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-6xl mx-auto w-full">
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Куда хочешь отправиться? <br/>
              <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-indigo-300 bg-clip-text text-transparent">Остальное устроит агент.</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium">
              Опиши поездку своими словами или выбери готовый трендовый вайб ниже.
            </p>
          </div>

          <div className="w-full overflow-x-auto py-6 mb-4 no-scrollbar">
            <div className="flex space-x-5 w-max mx-auto px-4">
              {presetCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => openChatWithQuery(card.title)}
                  className="w-72 h-44 rounded-2xl border border-cyan-500/30 p-5 flex flex-col justify-between cursor-pointer hover:scale-105 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 relative overflow-hidden group bg-[#0B132B]"
                >
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent"></div>

                  <div className="relative z-10">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-400/50 text-cyan-300 backdrop-blur-md">
                      {card.tag}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition">{card.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5 font-medium">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-2xl relative mt-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur-md opacity-30"></div>
            <div className="relative bg-[#0B132B] border border-cyan-600/50 rounded-2xl p-2 flex items-center shadow-2xl">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Например: хочу к теплому морю в ноябре, недорого с ребенком..."
                className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-400 text-sm md:text-base focus:outline-none"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black p-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
          
          {/* Чат с ИИ */}
          <div className="lg:col-span-7 bg-[#0B132B]/90 border border-cyan-900/40 rounded-2xl flex flex-col h-[calc(100vh-140px)] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-cyan-900/40 bg-[#0B132B] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400"></div>
                <span className="font-bold text-sm text-white">AI Консьерж на связи</span>
              </div>
              <span className="text-xs text-cyan-300/70 font-medium">Анализ в реальном времени</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium rounded-br-none shadow-md' 
                      : 'bg-[#152238] border border-cyan-800/40 text-slate-100 rounded-bl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#152238] border border-cyan-800/40 rounded-2xl px-4 py-3 text-sm text-cyan-200 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Агент подбирает варианты отелей и проверяет стыковки...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#0B132B] border-t border-cyan-900/40 flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => handleSend("📉 Сделай дешевле на 20%")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow-sm">
                📉 Дешевле на 20%
              </button>
              <button onClick={() => handleSend("🐶 С нами едет собака")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow-sm">
                🐶 Едем с собакой
              </button>
              <button onClick={() => handleSend("📅 Сдвинь даты на 2 дня вперед")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow-sm">
                📅 На 2 дня позже
              </button>
            </div>

            <div className="p-3 bg-[#030712] border-t border-cyan-900/40 flex items-center space-x-2">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напиши уточнение или правку..."
                className="flex-1 bg-[#152238] border border-cyan-800/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-cyan-400 text-white placeholder-slate-400"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 rounded-xl transition shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Правая колонка: Сравнение отелей и сценарий */}
          <div className="lg:col-span-5 flex flex-col space-y-4 h-[calc(100vh-140px)] overflow-y-auto pr-1">
            <div className="bg-[#0B132B]/90 border border-cyan-900/40 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
                <h2 className="font-bold text-base flex items-center space-x-2 text-white">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <span>Варианты отелей и сметы</span>
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                  Состыковано ✓
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-cyan-300">Доступные варианты (нажмите для выбора):</span>
                <div className="grid grid-cols-3 gap-2">
                  {hotelOptions.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHotel(h)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition ${
                        selectedHotel.id === h.id 
                          ? 'bg-cyan-600/30 border-cyan-400 text-white font-bold shadow-md' 
                          : 'bg-[#152238] border-cyan-900/50 text-slate-300 hover:bg-[#1c2c44]'
                      }`}
                    >
                      <div className="truncate">{h.name}</div>
                      <div className="text-[10px] text-cyan-300 mt-1">{h.price.toLocaleString()} ₽</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#152238] border border-cyan-800/40 rounded-xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center space-x-1">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>ВЫБРАН ОТЕЛЬ {selectedHotel.stars}</span>
                  </span>
                  <span className="text-xs bg-cyan-950 font-bold px-2 py-0.5 rounded text-cyan-200 border border-cyan-800">
                    {selectedHotel.rating} / 10
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">{selectedHotel.name}</h4>
                <p className="text-xs text-slate-300">{selectedHotel.tags}</p>
                
                <div className="text-xs text-cyan-100 bg-cyan-950/60 border border-cyan-500/30 p-3 rounded-lg leading-relaxed space-y-1">
                  <div className="font-bold text-cyan-300">💡 Почему этот выбор:</div>
                  <div>{selectedHotel.reason}</div>
                  <div className="text-cyan-200/80 pt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span><b>Риск:</b> {selectedHotel.risk}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#152238] border border-cyan-800/40 rounded-xl p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center space-x-1">
                    <Plane className="w-3.5 h-3.5" />
                    <span>ПЕРЕЛЕТ ТУДА И ОБРАТНО</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded">
                    Прямой рейс
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-white">
                  <span>{tripPlan.flight}</span>
                  <span className="text-cyan-300">{tripPlan.flightDate}</span>
                </div>
              </div>

              {tripPlan.hasPet && (
                <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-xl p-3 text-xs flex items-center justify-between text-cyan-200">
                  <div className="flex items-center space-x-2">
                    <Dog className="w-4 h-4 text-cyan-300" />
                    <span>Перевозка питомца</span>
                  </div>
                  <span className="font-bold text-white">+4 500 ₽</span>
                </div>
              )}

              <div className="pt-3 border-t border-cyan-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block font-medium">Итого за тур:</span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {(selectedHotel.price + (tripPlan.hasPet ? 4500 : 0)).toLocaleString()} ₽
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowVoucher(true)}
                  className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-sm font-black px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  Забронировать
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Вызов модалки метрик */}
      {showMetricsModal && <MetricsModal onClose={() => setShowMetricsModal(false)} />}

      {/* Модальное окно ваучера */}
      {showVoucher && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-cyan-600/50 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button onClick={() => setShowVoucher(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Бронирование успешно!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ваучер отправлен на вашу почту. Агент зафиксировал тур в системе.
            </p>

            <div className="border-t border-cyan-900/40 pt-3 text-left space-y-2">
              <span className="text-xs font-bold text-cyan-300 block">Управление бронированием:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => setPostActionNotice('Ранний заезд запрошен в отель!')}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-200 border border-cyan-900/40"
                >
                  🏨 Ранний заезд
                </button>
                <button 
                  onClick={() => setPostActionNotice('VIP трансфер подтвержден!')}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-200 border border-cyan-900/40"
                >
                  🚖 VIP Трансфер
                </button>
              </div>
              {postActionNotice && (
                <div className="text-xs text-emerald-300 bg-emerald-950/60 p-2 rounded-lg text-center font-medium">
                  ✓ {postActionNotice}
                </div>
              )}
            </div>

            <button 
              onClick={() => { setShowVoucher(false); setIsChatOpen(false); setPostActionNotice(''); }}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 py-3 rounded-xl font-black text-sm transition shadow-lg mt-2"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
