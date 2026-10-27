import React, { useState } from 'react';
import { 
  Send, Sparkles, Compass, Hotel, Plane, 
  ArrowRight, RefreshCw, CheckCircle2, X
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
  { 
    id: 5, 
    title: "Спонтанный уикенд", 
    subtitle: "Сочи • Море и горы сразу", 
    tag: "Быстро", 
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" 
  },
];

export default function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Привет! Я твой личный тревел-агент от Островка. Куда бы ты хотел отправиться или какой вайб ищешь?' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    setIsChatOpen(true);
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          sender: 'ai', 
          text: `Отличный выбор! Я проанализировал твой запрос ("${query}"). Подобрал идеальную связку: уютный бутик-отель с рейтингом 9.4, прямые перелеты без ночных стыковок и трансфер прямо к бирюзовому побережью. Посмотри справа детали и смету поездки!` 
        }
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleQuickAction = (actionText) => {
    handleSend(actionText);
  };

  return (
    <div className="min-h-screen bg-[#07131E] text-white flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Шапка */}
      <header className="border-b border-cyan-900/40 bg-[#07131E]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setIsChatOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">Островок</span>
            <span className="text-xs block text-cyan-400/80 font-semibold">AI Travel Agent</span>
          </div>
        </div>
        {isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(false)}
            className="text-xs font-semibold bg-slate-800/80 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-xl transition flex items-center space-x-1.5 text-cyan-200 shadow-sm"
          >
            <span>На главную</span>
          </button>
        )}
      </header>

      {/* Основной контент */}
      {!isChatOpen ? (
        /* ГЛАВНАЯ СТРАНИЦА */
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-6xl mx-auto w-full">
          
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Куда хочешь отправиться? <br/>
              <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Остальное устроит агент.</span>
            </h1>
            <p className="text-cyan-200/70 text-sm md:text-base max-w-xl mx-auto">
              Опиши поездку своими словами или выбери готовый трендовый вайб ниже.
            </p>
          </div>

          {/* 1. КАРТОЧКИ С ФОНОВЫМИ КАРТИНКАМИ (С ОТСТУПАМИ ДЛЯ ЭФФЕКТА HOVER) */}
          <div className="w-full overflow-x-auto py-4 mb-6 no-scrollbar">
            <div className="flex space-x-5 w-max mx-auto px-4 py-2">
              {presetCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => handleSend(card.title)}
                  className="w-72 h-44 rounded-2xl border border-cyan-500/30 p-5 flex flex-col justify-between cursor-pointer hover:scale-105 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Картинка фоном */}
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  {/* Градиентное затемнение поверх картинки */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131E] via-[#07131E]/60 to-cyan-950/30"></div>

                  <div className="relative z-10">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-400/40 text-cyan-300 backdrop-blur-md shadow-md">
                      {card.tag}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition">{card.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. СТРОКА ВВОДА ПОСЛЕ КАРТОЧЕК */}
          <div className="w-full max-w-2xl relative mt-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-md opacity-30"></div>
            <div className="relative bg-[#0E2232] border border-cyan-700/50 rounded-2xl p-2 flex items-center shadow-2xl">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Например: хочу к теплому морю в ноябре, недорого с ребенком..."
                className="w-full bg-transparent px-4 py-3 text-white placeholder-cyan-300/40 text-sm md:text-base focus:outline-none"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3.5 rounded-xl transition shadow-lg shadow-emerald-500/30 flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </main>
      ) : (
        /* СТРАНИЦА ЧАТА И КАРТОЧЕК */
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
          
          {/* Левая колонка: Чат с ИИ */}
          <div className="lg:col-span-7 bg-[#0E2232]/80 border border-cyan-900/50 rounded-2xl flex flex-col h-[calc(100vh-140px)] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-cyan-900/50 bg-[#0E2232] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></div>
                <span className="font-bold text-sm text-white">AI Консьерж на связи</span>
              </div>
              <span className="text-xs text-cyan-300/70 font-medium">Анализ в реальном времени</span>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4.5 py-3 text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-cyan-600 text-white font-medium rounded-br-none shadow-lg shadow-cyan-600/20' 
                      : 'bg-[#152E42] border border-cyan-800/50 text-slate-100 rounded-bl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#152E42] border border-cyan-800/40 rounded-2xl px-4 py-3 text-sm text-cyan-200 flex items-center space-x-2.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Агент подбирает лучшие варианты и проверяет состыковки...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Быстрые кнопки пересборки */}
            <div className="p-3 bg-[#0E2232] border-t border-cyan-900/50 flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => handleQuickAction("📉 Сделай дешевле на 20%")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow-sm">
                📉 Дешевле на 20%
              </button>
              <button onClick={() => handleQuickAction("🐶 С нами едет собака")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow-sm">
                🐶 Едем с собакой
              </button>
              <button onClick={() => handleQuickAction("📅 Сдвинь даты на 2 дня вперед")} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap transition text-white shadow-sm">
                📅 На 2 дня позже
              </button>
            </div>

            {/* Поле ввода в чате */}
            <div className="p-3 bg-[#0B1A27] border-t border-cyan-900/50 flex items-center space-x-2">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напиши уточнение или правку..."
                className="flex-1 bg-[#152E42] border border-cyan-800/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-cyan-400 text-white placeholder-cyan-300/40"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2.5 rounded-xl transition shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Правая колонка: Интерактивная корзина и план поездки */}
          <div className="lg:col-span-5 flex flex-col space-y-4 h-[calc(100vh-140px)] overflow-y-auto pr-1">
            
            <div className="bg-[#0E2232]/80 border border-cyan-900/50 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
                <h2 className="font-bold text-base flex items-center space-x-2 text-white">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <span>Сценарий вашей поездки</span>
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold shadow-sm">
                  Состыковано ✓
                </span>
              </div>

              {/* Отель */}
              <div className="bg-[#152E42] border border-cyan-800/50 rounded-xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center space-x-1 tracking-wide">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>ОТЕЛЬ 5★</span>
                  </span>
                  <span className="text-xs bg-cyan-900/80 font-semibold px-2 py-0.5 rounded text-cyan-200 border border-cyan-700/50">
                    9.4 из 10
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">Sunrise Garden Resort & Spa</h4>
                <p className="text-xs text-slate-300">Всё включено • Пляжная линия • Бесплатная отмена до 14 ноя</p>
                
                {/* Блок «Почему этот выбор» с четким фоном */}
                <div className="text-xs text-sky-100 bg-sky-950/80 border border-sky-500/40 p-3 rounded-lg leading-relaxed shadow-inner">
                  <span className="inline-block font-bold text-sky-300 mb-0.5">💡 Почему этот выбор:</span>
                  <p className="text-sky-100/90">Идеальный подогреваемый бассейн для ребенка, но трансфер до аэропорта займет 45 минут.</p>
                </div>
              </div>

              {/* Перелет */}
              <div className="bg-[#152E42] border border-cyan-800/50 rounded-xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center space-x-1 tracking-wide">
                    <Plane className="w-3.5 h-3.5" />
                    <span>ПЕРЕЛЕТ ТУДА И ОБРАТНО</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    Прямой рейс
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-white">
                  <span>Москва (VKO) ➔ Анталья (AYT)</span>
                  <span className="text-cyan-300">15 ноя, 06:05</span>
                </div>
              </div>

              {/* Итог и кнопка покупки */}
              <div className="pt-3 border-t border-cyan-900/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-cyan-300/70 block font-medium">Итого за всё:</span>
                  <span className="text-2xl font-black text-white tracking-tight">84 500 ₽</span>
                </div>
                
                {/* Акцентная яркая кнопка заката/пляжа */}
                <button 
                  onClick={() => setShowVoucher(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-sm font-extrabold px-6 py-3 rounded-xl transition shadow-lg shadow-orange-500/25 active:scale-95"
                >
                  Забронировать
                </button>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Модальное окно успешного бронирования */}
      {showVoucher && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex
