import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, Compass, Hotel, Plane, 
  ArrowRight, RefreshCw, CheckCircle2, X, AlertTriangle, ShieldCheck, Dog, Activity, Menu, Plus, MessageSquare
} from 'lucide-react';

// Трендовые карточки с быстрыми картинками и ключевыми направлениями
const presetCards = [
  { 
    id: 1, 
    destinationKey: 'japan',
    title: "Маршрут для зумеров", 
    subtitle: "Токио и Киото • 7 дней • Инста-места", 
    tag: "В тренде 🔥", 
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 2, 
    destinationKey: 'georgia',
    title: "Тбилиси • Инста-тур", 
    subtitle: "Грузия • 4 дня • Уютные дворики", 
    tag: "Хит недели", 
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 3, 
    destinationKey: 'turkey',
    title: "Чиловый пляж", 
    subtitle: "Анталья • Всё включено • Релакс", 
    tag: "Топ выбор 🏖️", 
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 4, 
    destinationKey: 'altai',
    title: "Горный перезагруз", 
    subtitle: "Алтай • Трекинг и баня", 
    tag: "Природа 🏔️", 
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
  },
];

// База данных направлений с реальными отелями и логистикой
const destinationDatabase = {
  japan: {
    country: 'Япония',
    city: 'Токио & Киото',
    flight: 'Москва (SVO) ➔ Токио (HND / Ханеда)',
    flightDate: '12 ноя, 19:20 (прямой рейс)',
    hotels: [
      {
        id: 'jp1',
        name: 'Aman Tokyo 5★',
        stars: '5★ Luxury',
        rating: '9.8',
        tags: 'Центр Токио • Спа с панорамой • Дизайн',
        price: 240000,
        reason: 'Эксклюзивный сервис, панорамные виды на город и гору Фудзи.',
        risk: 'Требуется оформление визы Японии.'
      },
      {
        id: 'jp2',
        name: 'Hotel Gracery Shinjuku 4★',
        stars: '4★',
        rating: '9.1',
        tags: 'Район Синдзюку • Рядом с метро',
        price: 135000,
        reason: 'Культовое место в эпицентре яркой ночной жизни Токио.',
        risk: 'Компактные размеры комнат.'
      }
    ]
  },
  georgia: {
    country: 'Грузия',
    city: 'Тбилиси',
    flight: 'Москва (VKO) ➔ Тбилиси (TBS)',
    flightDate: '15 ноя, 11:30',
    hotels: [
      {
        id: 'ge1',
        name: 'Stamba Hotel Tbilisi 5★',
        stars: '5★ Design',
        rating: '9.7',
        tags: 'Дизайн-отель • Атриум • Винный бар',
        price: 78000,
        reason: 'Самый стильный и обсуждаемый отель в историческом центре.',
        risk: 'Высокий спрос на бронирование столиков.'
      },
      {
        id: 'ge2',
        name: 'Rooms Hotel Tbilisi 4★',
        stars: '4★',
        rating: '9.3',
        tags: 'Район Вере • Атмосферная веранда',
        price: 54000,
        reason: 'Уютная богемная атмосфера для отдыха и работы.',
        risk: 'До старого города 15 минут пешком.'
      }
    ]
  },
  altai: {
    country: 'Россия',
    city: 'Алтай',
    flight: 'Москва (SVO) ➔ Горно-Алтайск (RGK)',
    flightDate: '20 ноя, 00:40',
    hotels: [
      {
        id: 'al1',
        name: 'Altay Village Teletskoe 5★',
        stars: '5★ Эко-Премиум',
        rating: '9.9',
        tags: 'Берег Телецкого озера • Кедровые шале',
        price: 160000,
        reason: 'Полное уединение среди дикой тайги с пятизвездочным сервисом.',
        risk: 'Трансфер из аэропорта занимает около 2.5 часов.'
      }
    ]
  },
  turkey: {
    country: 'Турция',
    city: 'Анталья',
    flight: 'Москва (VKO) ➔ Анталья (AYT)',
    flightDate: '10 ноя, 06:05',
    hotels: [
      {
        id: 'tr1',
        name: 'Sunrise Garden Resort & Spa 5★',
        stars: '5★ All Inclusive',
        rating: '9.4',
        tags: 'Первая линия • Подогреваемый бассейн',
        price: 84500,
        reason: 'Идеально для отдыха с детьми, аквапарк и анимация.',
        risk: 'Трансфер из аэропорта 45 минут.'
      },
      {
        id: 'tr2',
        name: 'Blue Wave Boutique Hotel 4★',
        stars: '4★',
        rating: '8.8',
        tags: 'Вторая линия • Завтраки',
        price: 67600,
        reason: 'Экономия 20% бюджета без потери качества отдыха.',
        risk: 'До пляжа 7 минут пешком.'
      }
    ]
  }
};

export default function App() {
  // Список отдельных чатов (каждый маршрут — свой чат)
  const [chats, setChats] = useState([
    { 
      id: 1, 
      title: 'Япония • Маршрут зумеров', 
      destinationKey: 'japan',
      messages: [
        { sender: 'ai', text: 'Привет! Я AI-агент Островка. Мы создали новый чат для вашего путешествия в Японию. Какой отель выберем?' }
      ],
      selectedHotel: destinationDatabase.japan.hotels[0],
      hasPet: false
    }
  ]);
  
  const [activeChatId, setActiveChatId] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [postActionNotice, setPostActionNotice] = useState('');

  // Ссылка для автопрокрутки чата вниз
  const messagesEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const currentDestination = destinationDatabase[activeChat.destinationKey] || destinationDatabase.japan;

  // Автопрокрутка вниз при изменении сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages, loading]);

  // Поддержка системной кнопки «Назад»
  useEffect(() => {
    const handlePopState = () => {
      if (isChatOpen) setIsChatOpen(false);
    };
    if (isChatOpen) window.history.pushState({ chatOpen: true }, '');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isChatOpen]);

  // Функция создания нового чата под конкретное направление
  const createNewChat = (destKey = 'turkey') => {
    const dest = destinationDatabase[destKey] || destinationDatabase.turkey;
    const newId = Date.now();
    const newChatObj = {
      id: newId,
      title: `${dest.country} • Новый тур`,
      destinationKey: destKey,
      messages: [
        { sender: 'ai', text: `Привет! Начинаем планирование поездки в ${dest.country} (${dest.city}). Чем могу помочь?` }
      ],
      selectedHotel: dest.hotels[0],
      hasPet: false
    };

    setChats(prev => [newChatObj, ...prev]);
    setActiveChatId(newId);
    setIsChatOpen(true);
    window.history.pushState({ chatOpen: true }, '');
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    setIsChatOpen(true);
    setInputQuery('');
    
    // Добавляем сообщение в текущий чат
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { sender: 'user', text: query }]
        };
      }
      return chat;
    }));

    setLoading(true);

    setTimeout(() => {
      let aiResponse = '';
      const q = query.toLowerCase();

      let targetDestKey = activeChat.destinationKey;
      if (q.includes('япони') || q.includes('токио') || q.includes('зумер')) targetDestKey = 'japan';
      else if (q.includes('грузи') || q.includes('тбилиси')) targetDestKey = 'georgia';
      else if (q.includes('алтай') || q.includes('горы')) targetDestKey = 'altai';
      else if (q.includes('турци') || q.includes('анталь')) targetDestKey = 'turkey';

      const destData = destinationDatabase[targetDestKey];

      if (q.includes('дешевле') || q.includes('бюджет')) {
        aiResponse = 'Пересчитал смету, подобрал более выгодный отель и проверил состыковку рейсов.';
      } else if (q.includes('собака') || q.includes('питомец')) {
        aiResponse = 'Добавил опцию Pet-Friendly! Учтены требования авиакомпании для перевозки животного (+4 500 ₽).';
      } else {
        aiResponse = `Проанализировал ваш запрос для направления «${destData.country}». Сформировал актуальный пакет: прямой рейс, трансфер и лучшие отели справа!`;
      }

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            destinationKey: targetDestKey,
            title: `${destData.country} • ${query.slice(0, 15)}...`,
            messages: [...chat.messages, { sender: 'ai', text: aiResponse }]
          };
        }
        return chat;
      }));
      setLoading(false);
    }, 1000);
  };

  const updateSelectedHotel = (hotel) => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, selectedHotel: hotel };
      }
      return chat;
    }));
  };

  const togglePet = () => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, hasPet: !chat.hasPet };
      }
      return chat;
    }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121B2B] via-[#0E2238] to-[#1F2937] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Боковая шторка с историей отдельных чатов */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex">
          <div className="w-80 bg-[#0E2238] border-r border-teal-500/30 p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <span className="font-extrabold text-xs text-teal-300 tracking-wider">ИСТОРИЯ ЧАТОВ (МАРШРУТЫ)</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={() => { createNewChat('japan'); setIsSidebarOpen(false); }}
                className="w-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Новый чат (Япония / Турция)</span>
              </button>

              <div className="space-y-2 pt-2 overflow-y-auto max-h-[60vh] no-scrollbar">
                {chats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => { setActiveChatId(chat.id); setIsChatOpen(true); setIsSidebarOpen(false); }}
                    className={`p-3 rounded-xl text-xs cursor-pointer flex items-center space-x-3 transition ${
                      activeChatId === chat.id ? 'bg-teal-600/30 border border-teal-400/50 text-white font-semibold' : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-teal-400 shrink-0" />
                    <div className="truncate">
                      <div className="truncate">{chat.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Чат поездки #{chat.id.toString().slice(-4)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-slate-700/60">
              Каждый новый тур открывается в отдельном чате
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* Шапка сайта */}
      <header className="border-b border-slate-700/50 bg-[#0E2840]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-teal-300 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setIsChatOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-amber-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-teal-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">Островок</span>
              <span className="text-[10px] block text-teal-300/90 font-semibold">AI Travel Agent</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowMetricsModal(true)}
            className="text-xs bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 px-3 py-2 rounded-xl transition flex items-center space-x-1.5 text-amber-200 shadow-sm"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Метрики Агента</span>
          </button>

          {isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-xs font-bold bg-slate-800 border border-slate-600 hover:bg-slate-700 px-4 py-2 rounded-xl transition text-slate-200 hidden sm:block"
            >
              На главную
            </button>
          )}
        </div>
      </header>

      {/* Главный экран или Интерфейс чата */}
      {!isChatOpen ? (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-6xl mx-auto w-full">
          
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Куда отправимся в этот раз? <br/>
              <span className="bg-gradient-to-r from-teal-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">Умный AI устроит всю поездку.</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium">
              Выберите карточку ниже (например, Япония) или начните новый чат со своим запросом.
            </p>
          </div>

          {/* Трендовые карточки */}
          <div className="w-full overflow-x-auto py-4 mb-4 no-scrollbar">
            <div className="flex space-x-4 w-max mx-auto px-4">
              {presetCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => createNewChat(card.destinationKey)}
                  className="w-72 h-48 rounded-2xl border border-slate-700/60 p-5 flex flex-col justify-between cursor-pointer hover:scale-105 hover:border-amber-400 transition-all duration-300 relative overflow-hidden group bg-[#0E2238] shadow-xl"
                >
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2238] via-[#0E2238]/60 to-transparent"></div>

                  <div className="relative z-10">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/60 text-amber-300 backdrop-blur-md shadow-md">
                      {card.tag}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition">{card.title}</h3>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Строка поиска */}
          <div className="w-full max-w-2xl relative mt-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl blur-md opacity-30"></div>
            <div className="relative bg-[#0E2238] border border-slate-600 rounded-2xl p-2 flex items-center shadow-2xl">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createNewChat('turkey')}
                placeholder="Например: хочу в Токио на неделю, отель 5 звезд..."
                className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-400 text-sm md:text-base focus:outline-none"
              />
              <button 
                onClick={() => createNewChat('turkey')}
                className="bg-gradient-to-r from-teal-400 to-amber-400 hover:from-teal-300 hover:to-amber-300 text-slate-950 font-black p-3.5 rounded-xl transition shadow-lg flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </main>
      ) : (
        /* Экран активного чата со сметкой */
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
          
          {/* Левая колонка - Чат с ИИ и автопрокруткой */}
          <div className="lg:col-span-7 bg-[#0E2238]/95 border border-slate-700/60 rounded-2xl flex flex-col h-[calc(100vh-140px)] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-700/60 bg-[#162D4A] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse shadow-sm shadow-teal-400"></div>
                <span className="font-bold text-sm text-white">AI Консьерж ({currentDestination.country})</span>
              </div>
              <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-medium">
                Чат #{activeChatId.toString().slice(-4)}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-br-none shadow-md' 
                      : 'bg-[#183456] border border-slate-600 text-slate-100 rounded-bl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#183456] border border-slate-600 rounded-2xl px-4 py-3 text-sm text-teal-200 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>AI подбирает отели и проверяет состыковки...</span>
                  </div>
                </div>
              )}
              {/* Невидимый элемент для автоскролла */}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-[#162D4A] border-t border-slate-700/60 flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => handleSend("🌸 Показать отели Японии")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white">
                🌸 Япония
              </button>
              <button onClick={() => handleSend("📉 Сделай дешевле на 20%")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white">
                📉 Дешевле
              </button>
              <button onClick={() => { togglePet(); handleSend("🐶 Едем с собакой"); }} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white">
                🐶 С питомцем
              </button>
            </div>

            <div className="p-3 bg-[#0E2238] border-t border-slate-700/60 flex items-center space-x-2">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напиши пожелание по поездке..."
                className="flex-1 bg-[#183456] border border-slate-600 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white placeholder-slate-400"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-2.5 rounded-xl transition shadow-md"
              >
                <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Правая колонка - Смета и выбор отелей */}
          <div className="lg:col-span-5 flex flex-col space-y-4 h-[calc(100vh-140px)] overflow-y-auto pr-1">
            <div className="bg-[#0E2238]/95 border border-slate-700/60 rounded-2xl p-5 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h2 className="font-bold text-base flex items-center space-x-2 text-white">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>Сценарий: {currentDestination.city}</span>
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                  Состыковано ✓
                </span>
              </div>

              {/* Выбор отелей текущей страны */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-teal-300">Доступные отели ({currentDestination.country}):</span>
                <div className="grid grid-cols-1 gap-2">
                  {currentDestination.hotels.map(h => (
                    <button
                      key={h.id}
                      onClick={() => updateSelectedHotel(h)}
                      className={`p-3 rounded-xl text-left border text-xs transition flex items-center justify-between ${
                        activeChat.selectedHotel.id === h.id 
                          ? 'bg-amber-500/25 border-amber-400 text-white font-bold shadow-md' 
                          : 'bg-[#183456] border-slate-700/60 text-slate-300 hover:bg-[#1f3f66]'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate text-sm text-white">{h.name}</div>
                        <div className="text-[10px] text-teal-300 mt-0.5">{h.stars} • {h.rating} / 10</div>
                      </div>
                      <div className="text-xs font-black text-amber-300 shrink-0">{h.price.toLocaleString()} ₽</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Детали выбранного отеля */}
              <div className="bg-[#183456] border border-slate-600 rounded-xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>ВЫБРАННЫЙ ОТЕЛЬ</span>
                  </span>
                  <span className="text-xs bg-teal-950 font-bold px-2 py-0.5 rounded text-teal-200 border border-slate-600">
                    {activeChat.selectedHotel.rating} / 10
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">{activeChat.selectedHotel.name}</h4>
                <p className="text-xs text-slate-300">{activeChat.selectedHotel.tags}</p>
                
                <div className="text-xs bg-amber-950/40 border border-amber-500/30 p-3 rounded-lg leading-relaxed space-y-1 text-amber-100">
                  <div className="font-bold text-amber-300">💡 Почему этот выбор:</div>
                  <div>{activeChat.selectedHotel.reason}</div>
                  <div className="text-amber-200/90 pt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><b>Ограничение:</b> {activeChat.selectedHotel.risk}</span>
                  </div>
                </div>
              </div>

              {/* Карточка перелета */}
              <div className="bg-[#183456] border border-slate-600 rounded-xl p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 flex items-center space-x-1">
                    <Plane className="w-3.5 h-3.5" />
                    <span>АВИАПЕРЕЛЕТ</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded">
                    Состыкован
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">
                  {currentDestination.flight}
                </div>
                <div className="text-xs text-teal-300">
                  Дата вылета: {currentDestination.flightDate}
                </div>
              </div>

              {activeChat.hasPet && (
                <div className="bg-teal-950/80 border border-teal-700/50 rounded-xl p-3 text-xs flex items-center justify-between text-teal-200">
                  <div className="flex items-center space-x-2">
                    <Dog className="w-4 h-4 text-amber-300" />
                    <span>Перевозка питомца в салоне</span>
                  </div>
                  <span className="font-bold text-white">+4 500 ₽</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block font-medium">Итого за весь тур:</span>
                  <span className="text-2xl font-black text-amber-300 tracking-tight">
                    {(activeChat.selectedHotel.price + (activeChat.hasPet ? 4500 : 0)).toLocaleString()} ₽
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowVoucher(true)}
                  className="bg-gradient-to-r from-teal-400 to-amber-400 hover:from-teal-300 hover:to-amber-300 text-slate-950 text-sm font-black px-6 py-3 rounded-xl transition shadow-lg active:scale-95"
                >
                  Забронировать
                </button>
              </div>

            </div>
          </div>
        </main>
      )}

      {/* Детальная страница метрик */}
      {showMetricsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E2238] border border-slate-600 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100">
            <button onClick={() => setShowMetricsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 border-b border-slate-700/60 pb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-extrabold text-white">Детальный отчет качества работы AI-агента</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#183456] p-4 rounded-xl border border-slate-600 space-y-1">
                <div className="font-bold text-teal-300">Время до первой рекомендации</div>
                <div className="text-xl font-black text-white">1.1 секунды</div>
                <div className="text-slate-300">Замер с момента отправки запроса пользователем до вывода первой связки отеля и перелета.</div>
              </div>
              <div className="bg-[#183456] p-4 rounded-xl border border-slate-600 space-y-1">
                <div className="font-bold text-teal-300">Успешность сценариев (Success Rate)</div>
                <div className="text-xl font-black text-emerald-400">98.4%</div>
                <div className="text-slate-300">Доля диалогов, успешно завершенных бронированием или выдачей готового плана.</div>
              </div>
              <div className="bg-[#183456] p-4 rounded-xl border border-slate-600 space-y-1">
                <div className="font-bold text-teal-300">Ошибки состыковок рейсов и отелей</div>
                <div className="text-xl font-black text-emerald-400">0.0%</div>
                <div className="text-slate-300">Проверка временных зазоров между прилетом самолета и заселением в номер.</div>
              </div>
              <div className="bg-[#183456] p-4 rounded-xl border border-slate-600 space-y-1">
                <div className="font-bold text-teal-300">Среднее количество уточнений</div>
                <div className="text-xl font-black text-amber-300">1.2 вопроса</div>
                <div className="text-slate-300">Агент задает минимум вопросов для построения точного и удовлетворяющего плана.</div>
              </div>
            </div>

            <button 
              onClick={() => setShowMetricsModal(false)}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-md"
            >
              Закрыть отчет
            </button>
          </div>
        </div>
      )}

      {/* Окно ваучера */}
      {showVoucher && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E2238] border border-slate-600 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button onClick={() => setShowVoucher(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Тур успешно забронирован!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ваучер на поездку в {currentDestination.country} отправлен вам на почту. Все документы зафиксированы.
            </p>

            <div className="border-t border-slate-700/60 pt-3 text-left space-y-2">
              <span className="text-xs font-bold text-teal-300 block">Пост-обслуживание туриста:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => setPostActionNotice('Ранний заезд запрошен в отель!')}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-200 border border-slate-600 transition"
                >
                  🏨 Ранний заезд
                </button>
                <button 
                  onClick={() => setPostActionNotice('Индивидуальный трансфер зафиксирован!')}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-200 border border-slate-600 transition"
                >
                  🚖 VIP Трансфер
                </button>
              </div>
              {postActionNotice && (
                <div className="text-xs text-emerald-300 bg-emerald-950/80 p-2 rounded-lg text-center font-medium border border-emerald-700/50">
                  ✓ {postActionNotice}
                </div>
              )}
            </div>

            <button 
              onClick={() => { setShowVoucher(false); setIsChatOpen(false); setPostActionNotice(''); }}
              className="w-full bg-gradient-to-r from-teal-400 to-amber-400 hover:from-teal-300 hover:to-amber-300 text-slate-950 py-3 rounded-xl font-black text-sm transition shadow-lg mt-2"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
