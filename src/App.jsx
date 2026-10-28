import React, { useState, useEffect } from 'react';
import { 
  Send, Sparkles, Compass, Hotel, Plane, 
  ArrowRight, RefreshCw, CheckCircle2, X, AlertTriangle, ShieldCheck, Dog, Activity, Menu, Plus, MessageSquare, MapPin
} from 'lucide-react';

// Карточки вдохновения
const presetCards = [
  { 
    id: 1, 
    destinationKey: 'japan',
    title: "Япония • Цветущая сакура", 
    subtitle: "Токио и Киото • 7 дней • Рёкан и Onsen", 
    tag: "Мечта 🌸", 
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 2, 
    destinationKey: 'georgia',
    title: "Тбилиси • Инста-тур", 
    subtitle: "Грузия • 4 дня • Уютные дворики и кофе", 
    tag: "В тренде 🔥", 
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
    subtitle: "Алтай • Телецкое озеро • Эко-отель", 
    tag: "Природа 🏔️", 
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
  },
];

// База данных реальных направлений, отелей и рейсов
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
        tags: 'Центр Токио • Спа с панорамой • Панорамный вид на Фудзи',
        price: 240000,
        reason: 'Эксклюзивный сервис, лучшее расположение в районе Отэмати.',
        risk: 'Потребуется оформление визы Японии (3-5 рабочих дней).'
      },
      {
        id: 'jp2',
        name: 'Hotel Gracery Shinjuku 4★',
        stars: '4★',
        rating: '9.1',
        tags: 'Район Синдзюку • Рядом с метро • Вид на город',
        price: 135000,
        reason: 'Идеально для прогулок по вечернему Токио и погружения в культуру.',
        risk: 'Компактные номера по сравнению с европейскими стандартами.'
      },
      {
        id: 'jp3',
        name: 'Kyoto Ryokan Yachiyo',
        stars: 'Традиционный Рёкан',
        rating: '9.6',
        tags: 'Горячие источники Onsen • Татами • Кайсэки ужин',
        price: 180000,
        reason: 'Аутентичный японский опыт с приватными купальнями на природе.',
        risk: 'Специфический спальный формат (футоны на татами).'
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
        tags: 'Центр • Исторический дизайн • Лучший завтрак',
        price: 78000,
        reason: 'Самый стильный дизайнерский отель Грузии с атриумом и винным баром.',
        risk: 'Высокий спрос на столы в ресторане отеля.'
      },
      {
        id: 'ge2',
        name: 'Rooms Hotel Tbilisi 4★',
        stars: '4★',
        rating: '9.3',
        tags: 'Район Вере • Терраса • Уютная атмосфера',
        price: 54000,
        reason: 'Культовое место в центре с атмосферной верандой и винтажным декором.',
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
        stars: '5★ Премиум Эко',
        rating: '9.9',
        tags: 'Берег Телецкого озера • Шале из кедра • Вертолетные экскурсии',
        price: 160000,
        reason: 'Уединённое шале на лоне дикой природы с собственным вертолетным клубом.',
        risk: 'Трансфер от аэропорта займет около 2.5 часов.'
      },
      {
        id: 'al2',
        name: 'Эко-курорт Марьин Остров 4★',
        stars: '4★ Health & Spa',
        rating: '9.0',
        tags: 'Река Чемал • Пантолечение • Оздоровление',
        price: 82000,
        reason: 'Медицинские и спа-программы перезагрузки организма на свежем воздухе.',
        risk: 'Спокойный семейный формат без шумных вечеринок.'
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
        tags: 'Первая линия • Подогреваемый бассейн • Pet-Friendly',
        price: 84500,
        reason: 'Лучший подогреваемый бассейн с морской водой и аквапарк.',
        risk: 'Трансфер из аэропорта займет 45 минут.'
      },
      {
        id: 'tr2',
        name: 'Blue Wave Boutique Hotel 4★',
        stars: '4★',
        rating: '8.8',
        tags: 'Вторая линия • Завтраки • Тихое место',
        price: 67600,
        reason: 'Уютный отель с экономией 20% без потери в качестве питания.',
        risk: 'До пляжа 7 минут пешком.'
      }
    ]
  }
};

export default function App() {
 const [chats] = useState([
    { id: 1, title: 'Япония • Сакура и Токио', date: 'Сегодня' },
    { id: 2, title: 'Тбилиси • Дизайн-тур', date: 'Вчера' }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ostrovok_chat_history');
    return saved ? JSON.parse(saved) : [
      { sender: 'ai', text: 'Привет! Я AI-агент Островка. Куда планируешь поехать? Напиши страну, город или выбери вариант на главной!' }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [postActionNotice, setPostActionNotice] = useState('');

  // Текущее выбранное направление и список отелей
  const [currentDestination, setCurrentDestination] = useState(destinationDatabase.japan);
  const [selectedHotel, setSelectedHotel] = useState(destinationDatabase.japan.hotels[0]);
  const [hasPet, setHasPet] = useState(false);

  // Кнопка «Назад» на телефонах закрывает чат
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

  const openChatWithKey = (destKey) => {
    const dest = destinationDatabase[destKey] || destinationDatabase.japan;
    setCurrentDestination(dest);
    setSelectedHotel(dest.hotels[0]);
    setIsChatOpen(true);
    window.history.pushState({ chatOpen: true }, '');
    handleSend(`Хочу поехать в направлении: ${dest.country} (${dest.city})`);
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
      const q = query.toLowerCase();

      // Определение страны/направления по контексту сообщения
      if (q.includes('япони') || q.includes('токио') || q.includes('киото') || q.includes('сакур')) {
        setCurrentDestination(destinationDatabase.japan);
        setSelectedHotel(destinationDatabase.japan.hotels[0]);
        aiResponse = 'Подобрал эксклюзивные варианты для Японии! Прямой рейс в Токио (Ханеда), топовые отели Aman и традиционные рёканы в Киото. Посмотри список отелей справа.';
      } 
      else if (q.includes('грузи') || q.includes('тбилиси')) {
        setCurrentDestination(destinationDatabase.georgia);
        setSelectedHotel(destinationDatabase.georgia.hotels[0]);
        aiResponse = 'Подготовил яркий маршрут по Тбилиси! Перелет и концептуальные отели Stamba / Rooms уже добавлены в ваш чек.';
      }
      else if (q.includes('алтай') || q.includes('горы') || q.includes('телецк')) {
        setCurrentDestination(destinationDatabase.altai);
        setSelectedHotel(destinationDatabase.altai.hotels[0]);
        aiResponse = 'Алтай — отличный выбор для перезагрузки! Подобрал эко-шале на берегу Телецкого озера с перелетом в Горно-Алтайск.';
      }
      else if (q.includes('дешевле') || q.includes('бюджет')) {
        if (currentDestination.hotels[1]) {
          setSelectedHotel(currentDestination.hotels[1]);
          aiResponse = `Переключил отель на более доступный вариант (${currentDestination.hotels[1].name}). Общая сметная стоимость снижена!`;
        } else {
          aiResponse = 'Пересчитал смету с учетом скидки на авиабилеты.';
        }
      }
      else if (q.includes('собака') || q.includes('питомец') || q.includes('животн')) {
        setHasPet(true);
        aiResponse = 'Добавил спец-опцию Pet-Friendly! Подобрал отель с разрешением на животных и включил авиаперевозку питомца в чек (+4 500 ₽).';
      }
      else {
        aiResponse = `Проанализировал ваш запрос ("${query}"). Сформировал смету с оптимальным перелетом и списком отелей под ваши критерии!`;
      }

      setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
      setLoading(false);
    }, 1000);
  };
 return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#0A192F] to-[#1E293B] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Выезжающая шторка истории диалогов */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex">
          <div className="w-80 bg-[#0A192F] border-r border-teal-500/30 p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-800/40">
                <span className="font-extrabold text-xs text-teal-300 tracking-wider">ИСТОРИЯ ДИАЛОГОВ</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={() => { setIsChatOpen(false); setIsSidebarOpen(false); }}
                className="w-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-200 text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Создать новый маршрут</span>
              </button>

              <div className="space-y-2 pt-2">
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
                      <div className="text-[10px] text-slate-400 mt-0.5">{chat.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-teal-900/40">
              Островок AI Travel Agent • Версия 2.5
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* Шапка сайта */}
      <header className="border-b border-teal-900/40 bg-[#0A192F]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-teal-500/30 text-teal-300 transition"
            title="Открыть историю"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setIsChatOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-amber-400 flex items-center justify-center shadow-md shadow-teal-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-teal-200 via-amber-200 to-amber-400 bg-clip-text text-transparent">Островок</span>
              <span className="text-[10px] block text-teal-300/90 font-semibold">AI Travel Agent</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowMetricsModal(true)}
            className="text-xs bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 px-3 py-2 rounded-xl transition flex items-center space-x-1.5 text-amber-200 shadow-sm"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Метрики Агента</span>
          </button>

          {isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-xs font-bold bg-slate-800 border border-teal-700/50 hover:bg-slate-700 px-4 py-2 rounded-xl transition text-teal-100 hidden sm:block"
            >
              На главную
            </button>
          )}
        </div>
      </header>

      {/* Основной экран */}
      {!isChatOpen ? (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-6xl mx-auto w-full">
          
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Куда отправимся в этот раз? <br/>
              <span className="bg-gradient-to-r from-teal-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">Умный AI устроит всю поездку.</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium">
              Опиши поездку (например: "Хочу в Японию на 7 дней в отель с Onsen") или выбери направление ниже.
            </p>
          </div>

          {/* Карточки популярных направлений */}
          <div className="w-full overflow-x-auto py-4 mb-4 no-scrollbar">
            <div className="flex space-x-4 w-max mx-auto px-4">
              {presetCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => openChatWithKey(card.destinationKey)}
                  className="w-72 h-48 rounded-2xl border border-teal-500/30 p-5 flex flex-col justify-between cursor-pointer hover:scale-105 hover:border-amber-400 transition-all duration-300 relative overflow-hidden group bg-[#0A192F] shadow-xl"
                >
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent"></div>

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
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-amber-400 to-amber-500 rounded-2xl blur-md opacity-30"></div>
            <div className="relative bg-[#0A192F] border border-teal-500/50 rounded-2xl p-2 flex items-center shadow-2xl">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Например: хочу в Токио на неделю, отель с сакурой и визовой поддержкой..."
                className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-400 text-sm md:text-base focus:outline-none"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-gradient-to-r from-teal-400 to-amber-400 hover:from-teal-300 hover:to-amber-300 text-slate-950 font-black p-3.5 rounded-xl transition shadow-lg flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </main>
      ) : (
        /* Чат и панель сметы */
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
          
          {/* Левая колонка - Чат с ИИ */}
          <div className="lg:col-span-7 bg-[#0A192F]/95 border border-teal-800/40 rounded-2xl flex flex-col h-[calc(100vh-140px)] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-teal-800/40 bg-[#0F2942] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse shadow-sm shadow-teal-400"></div>
                <span className="font-bold text-sm text-white">AI Консьерж Островка</span>
              </div>
              <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-medium">
                {currentDestination.country}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-br-none shadow-md' 
                      : 'bg-[#152A42] border border-teal-700/40 text-slate-100 rounded-bl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#152A42] border border-teal-700/40 rounded-2xl px-4 py-3 text-sm text-teal-200 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>AI подбирает отели, проверяет авиабилеты и состыковки...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Быстрые клипы правок */}
            <div className="p-3 bg-[#0F2942] border-t border-teal-800/40 flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => handleSend("🌸 Покажи отели Японии")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-teal-700/50 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white">
                🌸 Япония
              </button>
              <button onClick={() => handleSend("📉 Сделай дешевле на 20%")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-teal-700/50 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white">
                📉 Дешевле
              </button>
              <button onClick={() => handleSend("🐶 С нами едет собака")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-teal-700/50 font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white">
                🐶 С питомцем
              </button>
            </div>

            <div className="p-3 bg-[#0A192F] border-t border-teal-800/40 flex items-center space-x-2">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напиши пожелание по поездке..."
                className="flex-1 bg-[#152A42] border border-teal-700/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white placeholder-slate-400"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-2.5 rounded-xl transition shadow-md"
              >
                <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Правая колонка - Динамический выбор отеля и смета */}
          <div className="lg:col-span-5 flex flex-col space-y-4 h-[calc(100vh-140px)] overflow-y-auto pr-1">
            <div className="bg-[#0A192F]/95 border border-teal-800/40 rounded-2xl p-5 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-teal-800/40 pb-3">
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
                <span className="text-xs font-semibold text-teal-300">Доступные отели в {currentDestination.country}:</span>
                <div className="grid grid-cols-1 gap-2">
                  {currentDestination.hotels.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHotel(h)}
                      className={`p-3 rounded-xl text-left border text-xs transition flex items-center justify-between ${
                        selectedHotel.id === h.id 
                          ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md' 
                          : 'bg-[#152A42] border-teal-800/40 text-slate-300 hover:bg-[#1a3350]'
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
              <div className="bg-[#152A42] border border-teal-700/40 rounded-xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>ВЫБРАННЫЙ ОТЕЛЬ</span>
                  </span>
                  <span className="text-xs bg-teal-950 font-bold px-2 py-0.5 rounded text-teal-200 border border-teal-700">
                    {selectedHotel.rating} / 10
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">{selectedHotel.name}</h4>
                <p className="text-xs text-slate-300">{selectedHotel.tags}</p>
                
                <div className="text-xs bg-amber-950/40 border border-amber-500/30 p-3 rounded-lg leading-relaxed space-y-1 text-amber-100">
                  <div className="font-bold text-amber-300">💡 Почему этот выбор:</div>
                  <div>{selectedHotel.reason}</div>
                  <div className="text-amber-200/90 pt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><b>Ограничение/Виза:</b> {selectedHotel.risk}</span>
                  </div>
                </div>
              </div>

              {/* Карточка конкретного перелета */}
              <div className="bg-[#152A42] border border-teal-700/40 rounded-xl p-4 space-y-2 shadow-sm">
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

              {hasPet && (
                <div className="bg-teal-950/80 border border-teal-700/50 rounded-xl p-3 text-xs flex items-center justify-between text-teal-200">
                  <div className="flex items-center space-x-2">
                    <Dog className="w-4 h-4 text-amber-300" />
                    <span>Перевозка питомца в салоне</span>
                  </div>
                  <span className="font-bold text-white">+4 500 ₽</span>
                </div>
              )}

              <div className="pt-3 border-t border-teal-800/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block font-medium">Итого за весь тур:</span>
                  <span className="text-2xl font-black text-amber-300 tracking-tight">
                    {(selectedHotel.price + (hasPet ? 4500 : 0)).toLocaleString()} ₽
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

      {/* Полноценная модальная страница детальных метрик */}
      {showMetricsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-teal-500/50 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100">
            <button onClick={() => setShowMetricsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 border-b border-teal-800/40 pb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-extrabold text-white">Детальный отчет качества работы AI-агента</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#152A42] p-4 rounded-xl border border-teal-700/40 space-y-1">
                <div className="font-bold text-teal-300">Время до первой рекомендации</div>
                <div className="text-xl font-black text-white">1.1 секунды</div>
                <div className="text-slate-300">Замер с момента отправки запроса пользователем до вывода первой связки отеля и перелета.</div>
              </div>
              <div className="bg-[#152A42] p-4 rounded-xl border border-teal-700/40 space-y-1">
                <div className="font-bold text-teal-300">Успешность сценариев (Success Rate)</div>
                <div className="text-xl font-black text-emerald-400">98.4%</div>
                <div className="text-slate-300">Доля диалогов, успешно завершенных бронированием или выдачей готового плана.</div>
              </div>
              <div className="bg-[#152A42] p-4 rounded-xl border border-teal-700/40 space-y-1">
                <div className="font-bold text-teal-300">Ошибки состыковок рейсов и отелей</div>
                <div className="text-xl font-black text-emerald-400">0.0%</div>
                <div className="text-slate-300">Проверка временных зазоров между прилетом самолета и заселением в номер.</div>
              </div>
              <div className="bg-[#152A42] p-4 rounded-xl border border-teal-700/40 space-y-1">
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

      {/* Окно с ваучером бронирования */}
      {showVoucher && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-teal-500/50 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button onClick={() => setShowVoucher(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Тур успешно забронирован!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ваучер на {currentDestination.country} отправлен вам на почту. Все документы зафиксированы.
            </p>

            <div className="border-t border-teal-800/40 pt-3 text-left space-y-2">
              <span className="text-xs font-bold text-teal-300 block">Пост-обслуживание туриста:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => setPostActionNotice('Ранний заезд запрошен в отель!')}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-200 border border-teal-800/40 transition"
                >
                  🏨 Ранний заезд
                </button>
                <button 
                  onClick={() => setPostActionNotice('Индивидуальный трансфер зафиксирован!')}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-200 border border-teal-800/40 transition"
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

      
