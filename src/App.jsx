import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, Compass, Hotel, Plane, 
  ArrowRight, RefreshCw, CheckCircle2, X, AlertTriangle, ShieldCheck, Dog, Activity, Menu, Plus, MessageSquare 
} from 'lucide-react';

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
  { 
    id: 5, 
    destinationKey: 'dubai',
    title: "Дубайский шик", 
    subtitle: "ОАЭ • 5 дней • Небоскребы и шопинг", 
    tag: "Люкс ✨", 
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 6, 
    destinationKey: 'bali',
    title: "Балийский релакс", 
    subtitle: "Индонезия • 10 дней • Виллы и джунгли", 
    tag: "Экзотика 🌴", 
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" 
  }
];

const destinationDatabase = {
  japan: {
    country: 'Япония',
    city: 'Токио & Киото',
    flight: 'Москва (SVO) ➔ Токио (HND / Ханеда)',
    flightDate: '12 ноя, 19:20 (прямой рейс)',
    hotels: [
      { id: 'jp1', name: 'Aman Tokyo 5★', stars: '5★ Luxury', rating: '9.8', tags: 'Центр Токио • Спа • Панорама', price: 240000, reason: 'Эксклюзивный сервис и виды на Фудзи.', risk: 'Нужна виза Японии.' },
      { id: 'jp2', name: 'Hotel Gracery Shinjuku 4★', stars: '4★', rating: '9.1', tags: 'Синдзюку • Центр жизни', price: 135000, reason: 'Идеально для исследования ночного Токио.', risk: 'Компактные номера.' }
    ]
  },
  georgia: {
    country: 'Грузия',
    city: 'Тбилиси',
    flight: 'Москва (VKO) ➔ Тбилиси (TBS)',
    flightDate: '15 ноя, 11:30',
    hotels: [
      { id: 'ge1', name: 'Stamba Hotel Tbilisi 5★', stars: '5★ Design', rating: '9.7', tags: 'Дизайн • Атриум • Винный бар', price: 78000, reason: 'Самый стильный отель столицы.', risk: 'Высокий спрос в ресторанах.' },
      { id: 'ge2', name: 'Rooms Hotel Tbilisi 4★', stars: '4★', rating: '9.3', tags: 'Район Вере • Веранда', price: 54000, reason: 'Богемная и уютная атмосфера.', risk: 'До старого города 15 минут пешком.' }
    ]
  },
  altai: {
    country: 'Россия',
    city: 'Алтай',
    flight: 'Москва (SVO) ➔ Горно-Алтайск (RGK)',
    flightDate: '20 ноя, 00:40',
    hotels: [
      { id: 'al1', name: 'Altay Village Teletskoe 5★', stars: '5★ Эко', rating: '9.9', tags: 'Телецкое озеро • Шале', price: 160000, reason: 'Премиум-отдых в дикой тайге.', risk: 'Трансфер 2.5 часа от аэропорта.' }
    ]
  },
  turkey: {
    country: 'Турция',
    city: 'Анталья',
    flight: 'Москва (VKO) ➔ Анталья (AYT)',
    flightDate: '10 ноя, 06:05',
    hotels: [
      { id: 'tr1', name: 'Sunrise Garden Resort & Spa 5★', stars: '5★ All Inc', rating: '9.4', tags: 'Первая линия • Бассейн', price: 84500, reason: 'Отлично для семей с детьми.', risk: 'Трансфер 45 минут.' },
      { id: 'tr2', name: 'Blue Wave Boutique Hotel 4★', stars: '4★', rating: '8.8', tags: 'Вторая линия • Уютно', price: 67600, reason: 'Экономия 20% бюджета.', risk: 'До пляжа 7 минут пешком.' }
    ]
  },
  dubai: {
    country: 'ОАЭ',
    city: 'Дубай',
    flight: 'Москва (VKO) ➔ Дубай (DXB)',
    flightDate: '01 дек, 14:10',
    hotels: [
      { id: 'db1', name: 'Burj Al Arab Jumeirah 7★', stars: '7★ VIP', rating: '9.9', tags: 'Парус • Частный пляж • Личный батлер', price: 420000, reason: 'Максимальный уровень роскоши и статуса.', risk: 'Высокая стоимость.' },
      { id: 'db2', name: 'Rove Downtown 3★', stars: '3★', rating: '8.9', tags: 'Рядом с Burj Khalifa • Бассейн', price: 62000, reason: 'Отличное расположение по доступной цене.', risk: 'Компактные комнаты.' }
    ]
  },
  bali: {
    country: 'Индонезия',
    city: 'Бали (Убуд & Семиньяк)',
    flight: 'Москва (SVO) ➔ Денпасар (DPS)',
    flightDate: '10 янв, 21:00',
    hotels: [
      { id: 'bl1', name: 'Capella Ubud 5★', stars: '5★ Luxury Camp', rating: '9.8', tags: 'Джунгли • Частный бассейн • Спа', price: 210000, reason: 'Уникальные роскошные виллы среди нетронутой природы.', risk: 'Влажный тропический климат.' }
    ]
  }
};

export default function App() {
  const [chats, setChats] = useState([
    { 
      id: 1, 
      title: 'Япония • Маршрут зумеров', 
      destinationKey: 'japan',
      messages: [{ sender: 'ai', text: 'Привет! Я AI-агент Островка. План поездки в Японию готов. Выберите отель справа или напишите пожелания.' }],
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

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const currentDestination = destinationDatabase[activeChat.destinationKey] || destinationDatabase.japan;

  // Автопрокрутка чата вниз
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages, loading]);

  // Автопрокрутка ленты карточек на главной (каждые 3 секунды)
  useEffect(() => {
    if (isChatOpen) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isChatOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (isChatOpen) setIsChatOpen(false);
    };
    if (isChatOpen) window.history.pushState({ chatOpen: true }, '');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isChatOpen]);

  const selectPresetChat = (destKey) => {
    const dest = destinationDatabase[destKey] || destinationDatabase.japan;
    let targetChat = chats.find(c => c.destinationKey === destKey);
    
    if (!targetChat) {
      const newId = Date.now();
      targetChat = {
        id: newId,
        title: `${dest.country} • Тур`,
        destinationKey: destKey,
        messages: [{ sender: 'ai', text: `Создан новый тур в направлении: ${dest.country} (${dest.city}). Вся логистика и отели уже построены справа!` }],
        selectedHotel: dest.hotels[0],
        hasPet: false
      };
      setChats(prev => [targetChat, ...prev]);
    }

    setActiveChatId(targetChat.id);
    setIsChatOpen(true);
    setIsSidebarOpen(false);
    window.history.pushState({ chatOpen: true }, '');
  };

  const createBrandNewChat = () => {
    const newId = Date.now();
    const newChatObj = {
      id: newId,
      title: 'Новый диалог с агентом',
      destinationKey: 'turkey',
      messages: [{ sender: 'ai', text: 'Привет! Куда бы вы хотели отправиться? Расскажите о своих планах.' }],
      selectedHotel: destinationDatabase.turkey.hotels[0],
      hasPet: false
    };
    setChats(prev => [newChatObj, ...prev]);
    setActiveChatId(newId);
    setIsChatOpen(true);
    setIsSidebarOpen(false);
    window.history.pushState({ chatOpen: true }, '');
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    setInputQuery('');
    
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
      let targetDestKey = activeChat.destinationKey;
      let updatedHotel = activeChat.selectedHotel;
      let updatedPet = activeChat.hasPet;
      const q = query.toLowerCase();

      if (q.includes('япони') || q.includes('токио') || q.includes('киото')) targetDestKey = 'japan';
      else if (q.includes('грузи') || q.includes('тбилиси')) targetDestKey = 'georgia';
      else if (q.includes('алтай') || q.includes('горы')) targetDestKey = 'altai';
      else if (q.includes('турци') || q.includes('анталь')) targetDestKey = 'turkey';
      else if (q.includes('дубай') || q.includes('оаэ')) targetDestKey = 'dubai';
      else if (q.includes('бали')) targetDestKey = 'bali';

      const destData = destinationDatabase[targetDestKey];

      if (q.includes('дешевле') || q.includes('бюджет')) {
        if (destData.hotels[1]) {
          updatedHotel = destData.hotels[1];
          aiResponse = `Пересчитал стоимость! Переключил на более доступный отель: ${updatedHotel.name}. Цена снижена.`;
        } else {
          aiResponse = 'Для этого направления доступен премиум-сегмент, стоимость зафиксирована на оптимальном уровне.';
        }
      } else if (q.includes('собака') || q.includes('питомец')) {
        updatedPet = true;
        aiResponse = 'Добавил опцию Pet-Friendly (+4 500 ₽). Условия авиаперевозки питомца учтены в сметте.';
      } else {
        aiResponse = `Обработал запрос для направления «${destData.country}». Данные и отели обновлены в правой панели!`;
      }

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            destinationKey: targetDestKey,
            selectedHotel: updatedHotel,
            hasPet: updatedPet,
            title: `${destData.country} • ${query.slice(0, 12)}`,
            messages: [...chat.messages, { sender: 'ai', text: aiResponse }]
          };
        }
        return chat;
      }));
      setLoading(false);
    }, 800);
  };

  const updateSelectedHotel = (hotel) => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) return { ...chat, selectedHotel: hotel };
      return chat;
    }));
  };

  const togglePet = () => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) return { ...chat, hasPet: !chat.hasPet };
      return chat;
    }));
  };
  return (
    <div 
      className="w-full text-slate-100 flex flex-col font-sans selection:bg-[#06B6D4] selection:text-white"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A102F 0%, #251440 50%, #110A20 100%)'
      }}
    >
      
      {/* Боковая шторка истории */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
          <div className="w-80 bg-[#1A102F] border-r border-[#3B256B] p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#3B256B]">
                <span className="font-extrabold text-xs text-[#06B6D4] tracking-wider">ИСТОРИЯ ЧАТОВ</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={createBrandNewChat}
                className="w-full bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition"
              >
                <Plus className="w-4 h-4 text-[#06B6D4]" />
                <span>Новый чистый чат</span>
              </button>

              <div className="space-y-2 pt-2 overflow-y-auto max-h-[60vh] no-scrollbar">
                {chats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => { setActiveChatId(chat.id); setIsChatOpen(true); setIsSidebarOpen(false); }}
                    className={`p-3 rounded-xl text-xs cursor-pointer flex items-center space-x-3 transition ${
                      activeChatId === chat.id ? 'bg-[#2C1E4A] border border-[#06B6D4] text-white font-semibold shadow-md' : 'bg-[#150D24] hover:bg-[#201335] text-slate-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-[#06B6D4] shrink-0" />
                    <div className="truncate">
                      <div className="truncate">{chat.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">ID: #{chat.id.toString().slice(-4)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-[#3B256B]">
              Каждый тур изолирован в своем чате
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* Шапка */}
      <header className="border-b border-[#3B256B] bg-[#1A102F]/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-[#2C1E4A] hover:bg-[#3B256B] border border-[#3B256B] text-[#06B6D4] transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setIsChatOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#06B6D4]/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-[#06B6D4] via-[#FDE047] to-[#F59E0B] bg-clip-text text-transparent">Островок</span>
              <span className="text-[10px] block text-[#06B6D4] font-semibold">AI Travel Agent</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowMetricsModal(true)}
            className="text-xs bg-[#F59E0B]/15 border border-[#F59E0B]/40 hover:bg-[#F59E0B]/25 px-3 py-2 rounded-xl transition flex items-center space-x-1.5 text-[#FDE047] shadow-md"
          >
            <Activity className="w-4 h-4 text-[#F59E0B]" />
            <span className="font-bold">Метрики Агента</span>
          </button>

          {isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-xs font-bold bg-[#2C1E4A] border border-[#3B256B] hover:bg-[#3B256B] px-4 py-2 rounded-xl transition text-slate-200 hidden sm:block shadow-md"
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
              <span className="bg-gradient-to-r from-[#06B6D4] via-[#FDE047] to-[#F59E0B] bg-clip-text text-transparent">Умный AI устроит всю поездку.</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium">
              Лента направлений листается автоматически или вручную. Выберите карточку для старта чата.
            </p>
          </div>

          {/* Автоматическая карусель карточек */}
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto py-6 mb-4 no-scrollbar scroll-smooth"
          >
            <div className="flex space-x-5 w-max mx-auto px-4">
              {presetCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => selectPresetChat(card.destinationKey)}
                  className="w-72 h-48 rounded-2xl border border-[#3B256B] p-5 flex flex-col justify-between cursor-pointer hover:scale-105 hover:border-[#06B6D4] transition-all duration-300 relative overflow-hidden group bg-[#2C1E4A] shadow-2xl"
                >
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A102F] via-[#1A102F]/70 to-transparent"></div>

                  <div className="relative z-10">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#1A102F]/90 border border-[#F59E0B]/60 text-[#FDE047] backdrop-blur-md shadow-lg">
                      {card.tag}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#06B6D4] transition">{card.title}</h3>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-2xl relative mt-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#06B6D4] via-[#F59E0B] to-[#9333EA] rounded-2xl blur-lg opacity-40"></div>
            <div className="relative bg-[#2C1E4A] border border-[#3B256B] rounded-2xl p-2.5 flex items-center shadow-2xl">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createBrandNewChat()}
                placeholder="Например: хочу в Токио или Дубай на неделю..."
                className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-400 text-sm md:text-base focus:outline-none"
              />
              <button 
                onClick={createBrandNewChat}
                className="bg-gradient-to-r from-[#06B6D4] to-[#F59E0B] hover:opacity-90 text-slate-950 font-black p-3.5 rounded-xl transition shadow-lg flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </main>
      ) : (
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
          
          {/* Чат */}
          <div className="lg:col-span-7 bg-[#2C1E4A] border border-[#3B256B] rounded-2xl flex flex-col h-[calc(100vh-140px)] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#3B256B] bg-[#1A102F] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#06B6D4] animate-pulse"></div>
                <span className="font-bold text-sm text-white">AI Консьерж ({currentDestination.country})</span>
              </div>
              <span className="text-xs text-[#FDE047] bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-2.5 py-0.5 rounded-full font-medium">
                Чат #{activeChatId.toString().slice(-4)}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-slate-950 font-bold rounded-br-none shadow-lg' 
                      : 'bg-[#150D24] border border-[#3B256B] text-slate-100 rounded-bl-none shadow-md'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#150D24] border border-[#3B256B] rounded-2xl px-4 py-3 text-sm text-[#06B6D4] flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#F59E0B]" />
                    <span>AI рассчитывает смету и состыковывает рейсы...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-[#1A102F] border-t border-[#3B256B] flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => handleSend("📉 Сделай дешевле на 20%")} className="text-xs bg-[#2C1E4A] hover:bg-[#3B256B] border border-[#3B256B] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow">
                📉 Дешевле
              </button>
              <button onClick={() => { togglePet(); handleSend("🐶 С питомцем"); }} className="text-xs bg-[#2C1E4A] hover:bg-[#3B256B] border border-[#3B256B] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow">
                🐶 С питомцем
              </button>
            </div>

            <div className="p-3 bg-[#150D24] border-t border-[#3B256B] flex items-center space-x-2">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Задайте вопрос или попросите изменить отель..."
                className="flex-1 bg-[#2C1E4A] border border-[#3B256B] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#06B6D4] text-white placeholder-slate-400"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-slate-950 p-2.5 rounded-xl transition shadow-md"
              >
                <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Правая колонка - Смета */}
          <div className="lg:col-span-5 flex flex-col space-y-4 h-[calc(100vh-140px)] overflow-y-auto pr-1">
            <div className="bg-[#2C1E4A] border border-[#3B256B] rounded-2xl p-5 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#3B256B] pb-3">
                <h2 className="font-bold text-base flex items-center space-x-2 text-white">
                  <Compass className="w-5 h-5 text-[#F59E0B]" />
                  <span>Сценарий: {currentDestination.city}</span>
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                  Состыковано ✓
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#06B6D4]">Доступные отели ({currentDestination.country}):</span>
                <div className="grid grid-cols-1 gap-2">
                  {currentDestination.hotels.map(h => (
                    <button
                      key={h.id}
                      onClick={() => updateSelectedHotel(h)}
                      className={`p-3 rounded-xl text-left border text-xs transition flex items-center justify-between ${
                        activeChat.selectedHotel.id === h.id 
                          ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-white font-bold shadow-lg' 
                          : 'bg-[#150D24] border-[#3B256B] text-slate-300 hover:bg-[#201335]'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate text-sm text-white">{h.name}</div>
                        <div className="text-[10px] text-[#06B6D4] mt-0.5">{h.stars} • {h.rating} / 10</div>
                      </div>
                      <div className="text-xs font-black text-[#FDE047] shrink-0">{h.price.toLocaleString()} ₽</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#150D24] border border-[#3B256B] rounded-xl p-4 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F59E0B] flex items-center space-x-1">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>ВЫБРАННЫЙ ОТЕЛЬ</span>
                  </span>
                  <span className="text-xs bg-[#2C1E4A] font-bold px-2 py-0.5 rounded text-[#06B6D4] border border-[#3B256B]">
                    {activeChat.selectedHotel.rating} / 10
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">{activeChat.selectedHotel.name}</h4>
                <p className="text-xs text-slate-300">{activeChat.selectedHotel.tags}</p>
                
                <div className="text-xs bg-[#1A102F] border border-[#F59E0B]/30 p-3 rounded-lg leading-relaxed space-y-1 text-slate-200">
                  <div className="font-bold text-[#FDE047]">💡 Почему этот выбор:</div>
                  <div>{activeChat.selectedHotel.reason}</div>
                  <div className="text-amber-200/90 pt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    <span><b>Ограничение:</b> {activeChat.selectedHotel.risk}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#150D24] border border-[#3B256B] rounded-xl p-4 space-y-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#06B6D4] flex items-center space-x-1">
                    <Plane className="w-3.5 h-3.5" />
                    <span>АВИАПЕРЕЛЕТ</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded">
                    Состыкован
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">{currentDestination.flight}</div>
                <div className="text-xs text-[#06B6D4]">Дата вылета: {currentDestination.flightDate}</div>
              </div>

              {activeChat.hasPet && (
                <div className="bg-[#3B256B] border border-[#06B6D4]/40 rounded-xl p-3 text-xs flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Dog className="w-4 h-4 text-[#F59E0B]" />
                    <span>Перевозка питомца в салоне</span>
                  </div>
                  <span className="font-bold text-[#FDE047]">+4 500 ₽</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#3B256B] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block font-medium">Итого за весь тур:</span>
                  <span className="text-2xl font-black text-[#FDE047] tracking-tight">
                    {(activeChat.selectedHotel.price + (activeChat.hasPet ? 4500 : 0)).toLocaleString()} ₽
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowVoucher(true)}
                  className="bg-gradient-to-r from-[#06B6D4] to-[#F59E0B] hover:opacity-90 text-slate-950 text-sm font-black px-6 py-3 rounded-xl transition shadow-lg active:scale-95"
                >
                  Забронировать
                </button>
              </div>

            </div>
          </div>
        </main>
      )}

      {/* Модалка метрик с адаптивным скроллом */}
      {showMetricsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A102F] border border-[#06B6D4]/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative text-slate-100 no-scrollbar">
            <button onClick={() => setShowMetricsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 border-b border-[#3B256B] pb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-extrabold text-white">Детальный отчет качества работы AI-агента</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#2C1E4A] p-4 rounded-xl border border-[#3B256B] space-y-1 shadow-md">
                <div className="font-bold text-[#06B6D4]">Время до первой рекомендации</div>
                <div className="text-xl font-black text-white">1.1 секунды</div>
                <div className="text-slate-300">Замер с момента отправки запроса пользователем до вывода первой связки отеля и перелета.</div>
              </div>
              <div className="bg-[#2C1E4A] p-4 rounded-xl border border-[#3B256B] space-y-1 shadow-md">
                <div className="font-bold text-[#06B6D4]">Успешность сценариев (Success Rate)</div>
                <div className="text-xl font-black text-emerald-400">98.4%</div>
                <div className="text-slate-300">Доля диалогов, успешно завершенных бронированием или выдачей готового плана.</div>
              </div>
              <div className="bg-[#2C1E4A] p-4 rounded-xl border border-[#3B256B] space-y-1 shadow-md">
                <div className="font-bold text-[#06B6D4]">Ошибки состыковок рейсов и отелей</div>
                <div className="text-xl font-black text-emerald-400">0.0%</div>
                <div className="text-slate-300">Проверка временных зазоров между прилетом самолета и заселением в номер.</div>
              </div>
              <div className="bg-[#2C1E4A] p-4 rounded-xl border border-[#3B256B] space-y-1 shadow-md">
                <div className="font-bold text-[#06B6D4]">Среднее количество уточнений</div>
                <div className="text-xl font-black text-[#FDE047]">1.2 вопроса</div>
                <div className="text-slate-300">Агент задает минимум вопросов для построения точного и удовлетворяющего плана.</div>
              </div>
            </div>

            <button 
              onClick={() => setShowMetricsModal(false)}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-slate-950 font-black py-3 rounded-xl text-sm transition shadow-md"
            >
              Закрыть отчет
            </button>
          </div>
        </div>
      )}

      {/* Окно ваучера */}
      {showVoucher && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A102F] border border-[#F59E0B]/50 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative">
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

            <div className="border-t border-[#3B256B] pt-3 text-left space-y-2">
              <span className="text-xs font-bold text-[#06B6D4] block">Пост-обслуживание туриста:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => setPostActionNotice('Ранний заезд запрошен в отель!')}
                  className="bg-[#2C1E4A] hover:bg-[#3B256B] p-2 rounded-lg text-slate-200 border border-[#3B256B] transition"
                >
                  🏨 Ранний заезд
                </button>
                <button 
                  onClick={() => setPostActionNotice('Индивидуальный трансфер зафиксирован!')}
                  className="bg-[#2C1E4A] hover:bg-[#3B256B] p-2 rounded-lg text-slate-200 border border-[#3B256B] transition"
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
              className="w-full bg-gradient-to-r from-[#06B6D4] to-[#F59E0B] hover:opacity-90 text-slate-950 py-3 rounded-xl font-black text-sm transition shadow-lg mt-2"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
