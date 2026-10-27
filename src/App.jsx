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
          text: `Отличный выбор! Я проанализировал твой запрос ("${query}"). Подобрал идеальную связку: уютный бутик-отель с рейтингом 9.4, прямые перелеты без ночных стыковок и трансфер прямо к вайбовому побережью. Посмотри справа детали и смету поездки!` 
        }
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleQuickAction = (actionText) => {
    handleSend(actionText);
  };

  return (
    <div className="min-h-screen bg-[#0B0813] text-white flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Шапка */}
      <header className="border-b border-purple-900/40 bg-[#0B0813]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsChatOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Островок</span>
            <span className="text-xs block text-purple-400/70 font-medium">AI Travel Agent</span>
          </div>
        </div>
        {isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(false)}
            className="text-xs bg-purple-950/60 border border-purple-800/50 hover:bg-purple-900/60 px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
          >
            <span>На главную</span>
          </button>
        )}
      </header>

      {/* Основной контент */}
      {!isChatOpen ? (
        /* ГЛАВНАЯ СТРАНИЦА */
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-6xl mx-auto w-full">
          
          <div className="text-center mb-10 space-y-3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Куда хочешь отправиться? <br/>
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">Остальное устроит агент.</span>
            </h1>
            <p className="text-purple-300/70 text-sm md:text-base max-w-xl mx-auto">
              Опиши поездку своими словами или выбери готовый трендовый вайб ниже.
            </p>
          </div>

          {/* 1. КАРТОЧКИ С ФОНОВЫМИ КАРТИНКАМИ */}
          <div className="w-full overflow-x-auto pb-4 mb-8 no-scrollbar">
            <div className="flex space-x-4 w-max mx-auto px-2">
              {presetCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => handleSend(card.title)}
                  className="w-72 h-44 rounded-2xl border border-purple-500/30 p-5 flex flex-col justify-between cursor-pointer hover:scale-105 hover:border-purple-400 transition-all shadow-xl shadow-purple-950/60 relative overflow-hidden group"
                >
                  {/* Картинка фоном */}
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  {/* Градиентное затемнение поверх картинки */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0813] via-[#0B0813]/60 to-purple-950/40"></div>

                  <div className="relative z-10">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-200 backdrop-blur-md">
                      {card.tag}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">{card.title}</h3>
                    <p className="text-xs text-purple-200/80 mt-0.5">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. СТРОКА ВВОДА ПОСЛЕ КАРТОЧЕК */}
          <div className="w-full max-w-2xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl blur-md opacity-40"></div>
            <div className="relative bg-[#130E22] border border-purple-800/60 rounded-2xl p-2 flex items-center shadow-2xl">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Например: хочу к теплому морю в ноябре, недорого с ребенком..."
                className="w-full bg-transparent px-4 py-3 text-white placeholder-purple-400/40 text-sm md:text-base focus:outline-none"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white p-3 rounded-xl transition shadow-md shadow-purple-600/40 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </main>
      ) : (
        /* СТРАНИЦА ЧАТА И КАРТОЧЕК */
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
          
          {/* Левая колонка: Чат с ИИ */}
          <div className="lg:col-span-7 bg-[#130E22]/60 border border-purple-900/40 rounded-2xl flex flex-col h-[calc(100vh-140px)] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-purple-900/40 bg-[#130E22] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-semibold text-sm">AI Консьерж на связи</span>
              </div>
              <span className="text-xs text-purple-400/60">Анализ в реальном времени</span>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none shadow-lg shadow-purple-600/20' 
                      : 'bg-purple-950/50 border border-purple-800/40 text-purple-100 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-purple-950/40 border border-purple-800/30 rounded-2xl px-4 py-3 text-sm text-purple-300 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Агент подбирает лучшие варианты и проверяет состыковки...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Быстрые кнопки пересборки */}
            <div className="p-3 bg-[#130E22]/80 border-t border-purple-900/40 flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => handleQuickAction("📉 Сделай дешевле на 20%")} className="text-xs bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50 px-3 py-1.5 rounded-lg whitespace-nowrap transition">
                📉 Дешевле на 20%
              </button>
              <button onClick={() => handleQuickAction("🐶 С нами едет собака")} className="text-xs bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition">
                🐶 Едем с собакой
              </button>
              <button onClick={() => handleQuickAction("📅 Сдвинь даты на 2 дня вперед")} className="text-xs bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition">
                📅 На 2 дня позже
              </button>
            </div>

            {/* Поле ввода в чате */}
            <div className="p-3 bg-[#130E22] border-t border-purple-900/40 flex items-center space-x-2">
              <input 
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напиши уточнение или правку..."
                className="flex-1 bg-purple-950/40 border border-purple-800/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-purple-600 hover:bg-purple-500 p-2.5 rounded-xl transition shadow-md shadow-purple-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Правая колонка: Интерактивная корзина и план поездки */}
          <div className="lg:col-span-5 flex flex-col space-y-4 h-[calc(100vh-140px)] overflow-y-auto pr-1">
            
            <div className="bg-[#130E22]/60 border border-purple-900/40 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                <h2 className="font-bold text-base flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <span>Сценарий вашей поездки</span>
                </h2>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-full font-medium">
                  Состыковано ✓
                </span>
              </div>

              {/* Отель */}
              <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400 flex items-center space-x-1">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>ОТЕЛЬ 5★</span>
                  </span>
                  <span className="text-xs bg-purple-900/60 px-2 py-0.5 rounded text-purple-200">9.4 из 10</span>
                </div>
                <h4 className="font-bold text-sm">Sunrise Garden Resort & Spa</h4>
                <p className="text-xs text-purple-300/70">Всё включено • Пляжная линия • Бесплатная отмена до 14 ноя</p>
                <div className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-900/30 p-2 rounded-lg">
                  💡 <b>Почему этот выбор:</b> Идеальный подогреваемый бассейн для ребенка, но трансфер до аэропорта займет 45 минут.
                </div>
              </div>

              {/* Перелет */}
              <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400 flex items-center space-x-1">
                    <Plane className="w-3.5 h-3.5" />
                    <span>ПЕРЕЛЕТ ТУДА И ОБРАТНО</span>
                  </span>
                  <span className="text-xs text-emerald-400">Прямой рейс</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span>Москва (VKO) ➔ Анталья (AYT)</span>
                  <span>15 ноя, 06:05</span>
                </div>
              </div>

              {/* Итог и кнопка покупки */}
              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-purple-400/70 block">Итого за всё:</span>
                  <span className="text-2xl font-black text-white">84 500 ₽</span>
                </div>
                <button 
                  onClick={() => setShowVoucher(true)}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-purple-600/40"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16102B] border border-purple-700/50 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button onClick={() => setShowVoucher(false)} className="absolute top-4 right-4 text-purple-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Бронирование успешно!</h3>
            <p className="text-xs text-purple-300/80 leading-relaxed">
              Ваучер поездки отправлен на вашу почту. Агент зафиксировал все параметры и ждет вас для планирования следующих путешествий!
            </p>
            <button 
              onClick={() => { setShowVoucher(false); setIsChatOpen(false); }}
              className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold text-sm transition"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
