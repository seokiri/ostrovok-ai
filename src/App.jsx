import React, { useState, useEffect, useRef } from "react";
import {
  Send, Sparkles, Compass, Hotel, Plane, ArrowRight, RefreshCw,
  CheckCircle2, X, AlertTriangle, ShieldCheck, Dog, Activity,
  Menu, Plus, MessageSquare, MapPin
} from "lucide-react";

const API_URL = "https://ostrovok-ai.onrender.com/api/chat";

const presetCards = [
  {
    id: 1, destinationKey: "japan",
    title: "Маршрут для зумеров",
    subtitle: "Токио и Киото • 7 дней • Инста-места",
    tag: "В тренде 🔥",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2, destinationKey: "georgia",
    title: "Тбилиси • Инста-тур",
    subtitle: "Грузия • 4 дня • Уютные дворики",
    tag: "Хит недели",
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3, destinationKey: "turkey",
    title: "Чиловый пляж",
    subtitle: "Анталья • Всё включено • Релакс",
    tag: "Топ выбор 🏖️",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4, destinationKey: "altai",
    title: "Горный перезагруз",
    subtitle: "Алтай • Трекинг и баня",
    tag: "Природа 🏔️",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5, destinationKey: "dubai",
    title: "Дубайский шик",
    subtitle: "ОАЭ • 5 дней • Небоскрёбы и шопинг",
    tag: "Люкс ✨",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6, destinationKey: "bali",
    title: "Балийский релакс",
    subtitle: "Индонезия • 10 дней • Виллы и джунгли",
    tag: "Экзотика 🌴",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
  }
];

const destinationDatabase = {
  japan: {
    country: "Япония", city: "Токио и Киото",
    flight: "Москва (SVO) → Токио (HND)",
    flightDate: "Пример маршрута • даты уточняются",
    hotels: [
      {
        id: "jp1", name: "Aman Tokyo", stars: "5★ Luxury",
        rating: "9.8", tags: "Центр Токио • Спа • Панорама",
        price: 240000, reason: "Роскошный отдых и панорамные виды.",
        risk: "Стоимость и доступность нужно уточнить."
      },
      {
        id: "jp2", name: "Hotel Gracery Shinjuku", stars: "4★",
        rating: "9.1", tags: "Синдзюку • Рядом с развлечениями",
        price: 135000, reason: "Удобная база для знакомства с Токио.",
        risk: "Номера могут быть компактными."
      }
    ]
  },
  georgia: {
    country: "Грузия", city: "Тбилиси",
    flight: "Москва → Тбилиси",
    flightDate: "Пример маршрута • даты уточняются",
    hotels: [
      {
        id: "ge1", name: "Stamba Hotel", stars: "5★",
        rating: "9.7", tags: "Дизайн • Атриум • Ресторан",
        price: 78000, reason: "Стильный отель с выразительным интерьером.",
        risk: "Условия и стоимость нужно уточнить."
      },
      {
        id: "ge2", name: "Rooms Hotel Tbilisi", stars: "4★",
        rating: "9.3", tags: "Район Вере • Уютная атмосфера",
        price: 54000, reason: "Подойдёт для неспешного городского отдыха.",
        risk: "Уточни расположение и доступность."
      }
    ]
  },
  turkey: {
    country: "Турция", city: "Анталья",
    flight: "Москва → Анталья",
    flightDate: "Пример маршрута • даты уточняются",
    hotels: [
      {
        id: "tr1", name: "Отель на первой линии",
        stars: "5★", rating: "—",
        tags: "Пляж • Бассейн • Отдых",
        price: 84500, reason: "Пример пляжного отдыха с комфортом.",
        risk: "Название и условия необходимо проверить."
      },
      {
        id: "tr2", name: "Бутик-отель у моря",
        stars: "4★", rating: "—",
        tags: "Море • Уют • Прогулки",
        price: 67600, reason: "Пример более бюджетного варианта.",
        risk: "Это демонстрационный вариант."
      }
    ]
  },
  altai: {
    country: "Россия", city: "Алтай",
    flight: "Москва → Горно-Алтайск",
    flightDate: "Пример маршрута • даты уточняются",
    hotels: [
      {
        id: "al1", name: "Загородный эко-отель на Алтае",
        stars: "5★", rating: "—",
        tags: "Горы • Природа • Отдых",
        price: 160000, reason: "Для отдыха среди красивых пейзажей.",
        risk: "Это демонстрационный вариант."
      }
    ]
  },
  dubai: {
    country: "ОАЭ", city: "Дубай",
    flight: "Москва → Дубай",
    flightDate: "Пример маршрута • даты уточняются",
    hotels: [
      {
        id: "db1", name: "Burj Al Arab Jumeirah",
        stars: "Luxury", rating: "—",
        tags: "Роскошь • Море • Сервис",
        price: 420000, reason: "Пример премиального размещения.",
        risk: "Цена и доступность требуют проверки."
      },
      {
        id: "db2", name: "Rove Downtown",
        stars: "3★", rating: "—",
        tags: "Город • Удобное расположение",
        price: 62000, reason: "Пример более доступного городского отдыха.",
        risk: "Цена и наличие не проверены."
      }
    ]
  },
  bali: {
    country: "Индонезия", city: "Бали",
    flight: "Москва → Денпасар",
    flightDate: "Пример маршрута • даты уточняются",
    hotels: [
      {
        id: "bl1", name: "Capella Ubud",
        stars: "5★", rating: "—",
        tags: "Джунгли • Виллы • Спа",
        price: 210000, reason: "Идея для уединённого отдыха на природе.",
        risk: "Цена и доступность требуют проверки."
      }
    ]
  }
};

const palette = {
  page: "#141827",
  header: "#191E30",
  card: "#22283B",
  inset: "#191F31",
  border: "#363D55",
  accent: "#B8B9F5",
  accentHover: "#999BEA",
  gold: "#E8D4A2",
  muted: "#AAB2C5"
};

const formatPrice = (value) =>
  `${Math.max(0, Number(value) || 0).toLocaleString("ru-RU")} ₽`;

const normaliseHotel = (hotel, index) => ({
  id: String(hotel.id || `ai-hotel-${index + 1}`),
  name: String(hotel.name || "Вариант размещения"),
  stars: String(hotel.stars ?? "—"),
  rating: hotel.rating ?? "—",
  tags: Array.isArray(hotel.tags)
    ? hotel.tags.join(" • ")
    : String(hotel.tags || "Подробности уточняются"),
  price: Math.max(0, Number(hotel.price) || 0),
  reason: String(hotel.reason || "Вариант для рассмотрения."),
  risk: String(
    hotel.risk || "Уточни актуальные цены и условия размещения."
  )
});

export default function App() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "Япония • Маршрут зумеров",
      destinationKey: "japan",
      trip: null,
      messages: [{
        sender: "ai",
        text: "Привет! Я AI-агент Островка. План поездки в Японию готов. Выбери отель справа или расскажи, что хочешь изменить."
      }],
      selectedHotel: destinationDatabase.japan.hotels[0],
      hasPet: false
    }
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [postActionNotice, setPostActionNotice] = useState("");

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const activeChat = chats.find(chat => chat.id === activeChatId) || chats[0];
  const baseDestination =
    destinationDatabase[activeChat.destinationKey] || destinationDatabase.japan;

  const currentDestination = activeChat.trip
    ? {
        ...baseDestination,
        ...activeChat.trip,
        hotels: Array.isArray(activeChat.trip.hotels)
          ? activeChat.trip.hotels.map(normaliseHotel)
          : baseDestination.hotels
      }
    : baseDestination;

  const hotelList = currentDestination.hotels || [];
  const selectedHotel =
    hotelList.find(hotel => hotel.id === activeChat.selectedHotel?.id) ||
    hotelList[0] ||
    null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages, loading]);

  useEffect(() => {
    if (isChatOpen) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isChatOpen]);

  useEffect(() => {
    const handlePopState = () => setIsChatOpen(false);
    if (isChatOpen) window.history.pushState({ chatOpen: true }, "");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isChatOpen]);

  const openChat = (chatId) => {
    setActiveChatId(chatId);
    setIsChatOpen(true);
    setIsSidebarOpen(false);
    setShowVoucher(false);
  };

  const selectPresetChat = (destKey) => {
    const dest = destinationDatabase[destKey] || destinationDatabase.japan;
    let targetChat = chats.find(chat => chat.destinationKey === destKey);

    if (!targetChat) {
      targetChat = {
        id: Date.now(),
        title: `${dest.country} • Тур`,
        destinationKey: destKey,
        trip: null,
        messages: [{
          sender: "ai",
          text: `Открыт пример маршрута: ${dest.country}, ${dest.city}. Можешь задать вопрос или изменить план поездки.`
        }],
        selectedHotel: dest.hotels[0] || null,
        hasPet: false
      };
      setChats(prev => [targetChat, ...prev]);
    }

    openChat(targetChat.id);
  };
  
  const handleSend = async (
    textToSend,
    targetChatId = activeChatId,
    historyOverride = null
  ) => {
    const query = String(textToSend ?? inputQuery).trim();
    if (!query || loading) return;

    const targetChat =
      chats.find(chat => chat.id === targetChatId) || activeChat;

    const history = historyOverride || targetChat.messages;

    setInputQuery("");
    setChats(prev => prev.map(chat =>
      chat.id === targetChatId
        ? {
            ...chat,
            messages: [...chat.messages, { sender: "user", text: query }]
          }
        : chat
    ));
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: history.map(item => ({
            sender: item.sender,
            text: item.text
          })),
          currentTrip: targetChat.trip || {
            country: destinationDatabase[targetChat.destinationKey]?.country,
            city: destinationDatabase[targetChat.destinationKey]?.city
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось получить ответ от ИИ.");
      }

      const newTrip =
        data.trip && typeof data.trip === "object"
          ? {
              ...data.trip,
              hotels: Array.isArray(data.trip.hotels)
                ? data.trip.hotels.map(normaliseHotel)
                : []
            }
          : null;

      setChats(prev => prev.map(chat => {
        if (chat.id !== targetChatId) return chat;

        const updatedTrip = newTrip || chat.trip;
        const updatedHotels = updatedTrip?.hotels || [];
        const previousHotelId = chat.selectedHotel?.id;
        const nextHotel =
          updatedHotels.find(hotel => hotel.id === previousHotelId) ||
          updatedHotels[0] ||
          chat.selectedHotel ||
          destinationDatabase[chat.destinationKey]?.hotels?.[0] ||
          null;

        const firstUserRequest = chat.title === "Новый диалог с агентом";

        return {
          ...chat,
          title: firstUserRequest ? query.slice(0, 32) : chat.title,
          trip: updatedTrip,
          selectedHotel: nextHotel,
          messages: [
            ...chat.messages,
            {
              sender: "ai",
              text: typeof data.answer === "string"
                ? data.answer
                : "Давай уточним детали твоей поездки."
            }
          ]
        };
      }));
    } catch (error) {
      setChats(prev => prev.map(chat =>
        chat.id === targetChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  sender: "ai",
                  text: `Не удалось связаться с ИИ. ${error.message || "Попробуй ещё раз."}`
                }
              ]
            }
          : chat
      ));
    } finally {
      setLoading(false);
    }
  };

  const createBrandNewChat = (initialQuery = "") => {
    if (loading) return;

    const newId = Date.now();
    const query = initialQuery.trim();

    const newChat = {
      id: newId,
      title: query ? query.slice(0, 32) : "Новый диалог с агентом",
      destinationKey: "japan",
      trip: null,
      messages: query
        ? []
        : [{
            sender: "ai",
            text: "Привет! Куда хочешь отправиться? Расскажи о направлении, датах и бюджете."
          }],
      selectedHotel: destinationDatabase.japan.hotels[0],
      hasPet: false
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    setIsChatOpen(true);
    setIsSidebarOpen(false);
    setShowVoucher(false);

    if (query) {
      handleSend(query, newId, []);
    }
  };

  const updateSelectedHotel = (hotel) => {
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, selectedHotel: hotel }
        : chat
    ));
  };

  const togglePet = () => {
    const nextValue = !activeChat.hasPet;

    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, hasPet: nextValue }
        : chat
    ));

    handleSend(
      nextValue
        ? "Я путешествую с питомцем. Учти это в маршруте и предложениях по размещению."
        : "Я больше не путешествую с питомцем. Обнови рекомендации.",
      activeChatId
    );
  };

  const sendCheaperRequest = () => {
    handleSend(
      "Предложи более бюджетные варианты поездки и отелей. Постарайся сократить общий бюджет примерно на 20%, сохранив направление.",
      activeChatId
    );
  };

  const goHome = () => {
    setIsChatOpen(false);
    setIsSidebarOpen(false);
    setShowVoucher(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col font-sans text-slate-100 selection:bg-indigo-300 selection:text-slate-900"
      style={{
        background: "linear-gradient(135deg, #141827 0%, #20233A 52%, #141827 100%)"
      }}
    >
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/65 backdrop-blur-sm">
          <aside
            className="w-80 max-w-[85vw] p-5 flex flex-col justify-between shadow-2xl border-r"
            style={{ background: palette.header, borderColor: palette.border }}
          >
            <div className="space-y-4">
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: palette.border }}
              >
                <span
                  className="text-xs font-extrabold tracking-wider"
                  style={{ color: palette.accent }}
                >
                  ИСТОРИЯ ЧАТОВ
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                  aria-label="Закрыть историю"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => createBrandNewChat()}
                className="w-full rounded-xl border py-3 text-xs font-bold flex items-center justify-center gap-2 transition hover:brightness-110"
                style={{
                  background: "#292E48",
                  borderColor: palette.border,
                  color: palette.accent
                }}
              >
                <Plus className="h-4 w-4" />
                Новый чат
              </button>

              <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => openChat(chat.id)}
                    className="w-full rounded-xl p-3 text-left text-xs flex items-center gap-3 transition"
                    style={{
                      background: activeChatId === chat.id ? "#303651" : palette.inset,
                      border: `1px solid ${activeChatId === chat.id ? palette.accent : palette.border}`,
                      color: "#F1F3F9"
                    }}
                  >
                    <MessageSquare
                      className="h-4 w-4 shrink-0"
                      style={{ color: palette.accent }}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{chat.title}</span>
                      <span className="mt-1 block text-[10px] text-slate-400">
                        Диалог #{String(chat.id).slice(-4)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="border-t pt-4 text-center text-[11px] text-slate-400" style={{ borderColor: palette.border }}>
              История диалогов в рамках текущего сеанса
            </p>
          </aside>
          <button
            className="flex-1"
            aria-label="Закрыть меню"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b px-4 py-3.5 shadow-lg backdrop-blur-md md:px-6"
        style={{
          background: "rgba(25, 30, 48, 0.96)",
          borderColor: palette.border
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl border p-2 transition hover:brightness-125"
            style={{
              background: palette.card,
              borderColor: palette.border,
              color: palette.accent
            }}
            aria-label="Открыть историю чатов"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            className="flex min-w-0 items-center gap-2.5 text-left"
            onClick={goHome}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #B8B9F5, #E8D4A2)" }}
            >
              <Sparkles className="h-4 w-4 text-slate-900" />
            </span>
            <span>
              <span className="block bg-gradient-to-r from-[#06B6D4] via-[#FDE047] to-[#F59E0B] bg-clip-text text-lg font-black tracking-wide text-transparent">
                Островок
              </span>
              <span className="block text-[10px] font-semibold" style={{ color: palette.accent }}>
                AI Travel Agent
              </span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMetricsModal(true)}
            className="flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs transition hover:brightness-110 sm:px-3"
            style={{
              background: palette.card,
              borderColor: palette.border,
              color: palette.gold
            }}
          >
            <Activity className="h-4 w-4" />
            <span className="hidden font-bold sm:inline">Метрики агента</span>
            <span className="font-bold sm:hidden">Метрики</span>
          </button>

          {isChatOpen && (
            <button
              onClick={goHome}
              className="hidden rounded-xl border px-3 py-2 text-xs font-bold transition hover:brightness-125 sm:block"
              style={{
                background: palette.card,
                borderColor: palette.border,
                color: "#E4E7F1"
              }}
            >
              На главную
            </button>
          )}
        </div>
      </header>

      {!isChatOpen ? (
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="mb-7 space-y-3 text-center">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Куда отправимся в этот раз?
              <br />
              <span className="bg-gradient-to-r from-[#06B6D4] via-[#FDE047] to-[#F59E0B] bg-clip-text text-transparent">
                Умный AI устроит всю поездку.
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-sm font-medium text-slate-300 md:text-base">
              Выбери готовый пример или напиши, куда хочешь отправиться.
            </p>
          </div>

          <div
            ref={scrollContainerRef}
            className="no-scrollbar mb-4 w-full overflow-x-auto scroll-smooth py-5"
          >
            <div className="mx-auto flex w-max gap-4 px-4">
              {presetCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => selectPresetChat(card.destinationKey)}
                  className="group relative flex h-48 w-72 flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left shadow-xl transition duration-300 hover:scale-[1.025]"
                  style={{ background: palette.card, borderColor: palette.border }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#141827] via-[#141827]/70 to-transparent" />
                  <span className="relative z-10">
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-extrabold backdrop-blur-sm"
                      style={{
                        background: "rgba(25, 30, 48, 0.85)",
                        borderColor: "#B7A987",
                        color: palette.gold
                      }}
                    >
                      {card.tag}
                    </span>
                  </span>
                  <span className="relative z-10">
                    <span className="block text-lg font-bold text-white transition group-hover:text-indigo-200">
                      {card.title}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-slate-200">
                      {card.subtitle}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form
            className="relative mt-4 w-full max-w-2xl"
            onSubmit={event => {
              event.preventDefault();
              createBrandNewChat(inputQuery);
            }}
          >
            <div
              className="absolute -inset-1 rounded-2xl opacity-25 blur-lg"
              style={{ background: "linear-gradient(90deg, #B8B9F5, #E8D4A2, #818CF8)" }}
            />
            <div
              className="relative flex items-center rounded-2xl border p-2.5 shadow-2xl"
              style={{ background: palette.card, borderColor: palette.border }}
            >
              <input
                type="text"
                value={inputQuery}
                onChange={event => setInputQuery(event.target.value)}
                placeholder="Например: хочу в Сеул на неделю..."
                className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 md:text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 rounded-xl p-3.5 font-black text-slate-900 shadow-md transition hover:brightness-110 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #B8B9F5, #E8D4A2)" }}
                aria-label="Начать планирование"
              >
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </main>
      ) : (
        <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 overflow-hidden p-4 md:p-6 lg:grid-cols-12">
          <section
            className="flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-2xl border shadow-xl lg:col-span-7"
            style={{ background: palette.card, borderColor: palette.border }}
          >
            <div
              className="flex items-center justify-between gap-2 border-b p-4"
              style={{ background: palette.header, borderColor: palette.border }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 animate-pulse rounded-full"
                  style={{ background: palette.accent }}
                />
                <span className="text-sm font-bold text-white">
                  AI-консьерж ({currentDestination.country})
                </span>
              </div>
              <span
                className="rounded-full border px-2.5 py-1 text-xs font-medium"
                style={{
                  background: "#302F43",
                  borderColor: palette.border,
                  color: palette.gold
                }}
              >
                Чат #{String(activeChatId).slice(-4)}
              </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {activeChat.messages.map((message, index) => (
                <div
                  key={`${activeChatId}-${index}`}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "rounded-br-sm font-medium text-slate-900"
                        : "rounded-bl-sm border text-slate-100"
                    }`}
                    style={
                      message.sender === "user"
                        ? { background: "linear-gradient(135deg, #B8B9F5, #D7D8F8)" }
                        : { background: palette.inset, borderColor: palette.border }
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm"
                    style={{
                      background: palette.inset,
                      borderColor: palette.border,
                      color: palette.accent
                    }}
                  >
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>ИИ планирует поездку...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              className="flex gap-2 overflow-x-auto border-t p-3"
              style={{ background: palette.header, borderColor: palette.border }}
            >
              <button
                onClick={sendCheaperRequest}
                disabled={loading}
                className="whitespace-nowrap rounded-lg border px-3 py-2 text-xs transition hover:brightness-110 disabled:opacity-50"
                style={{ background: palette.card, borderColor: palette.border, color: "#E4E7F1" }}
              >
                ↓ Дешевле
              </button>
              <button
                onClick={togglePet}
                disabled={loading}
                className="whitespace-nowrap rounded-lg border px-3 py-2 text-xs transition hover:brightness-110 disabled:opacity-50"
                style={{ background: palette.card, borderColor: palette.border, color: "#E4E7F1" }}
              >
                🐶 {activeChat.hasPet ? "Убрать питомца" : "С питомцем"}
              </button>
            </div>

            <form
              className="flex items-center gap-2 border-t p-3"
              style={{ background: palette.inset, borderColor: palette.border }}
              onSubmit={event => {
                event.preventDefault();
                handleSend();
              }}
            >
               <input
                type="text"
                value={inputQuery}
                onChange={event => setInputQuery(event.target.value)}
                placeholder="Напиши, что хочешь изменить..."
                className="min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
                style={{ background: palette.card, borderColor: palette.border }}
              />
              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="rounded-xl p-3 text-slate-900 transition hover:brightness-110 disabled:opacity-50"
                style={{ background: palette.accent }}
                aria-label="Отправить сообщение"
              >
                <Send className="h-4 w-4 stroke-[2.5]" />
              </button>
            </form>
          </section>
          
          <aside className="flex h-[calc(100vh-140px)] flex-col gap-4 overflow-y-auto pr-1 lg:col-span-5">
            <section
              className="space-y-4 rounded-2xl border p-5 shadow-xl"
              style={{ background: palette.card, borderColor: palette.border }}
            >
              <div
                className="flex items-center justify-between gap-2 border-b pb-3"
                style={{ borderColor: palette.border }}
              >
                <h2 className="flex items-center gap-2 text-base font-bold text-white">
                  <Compass className="h-5 w-5" style={{ color: palette.gold }} />
                  <span>План: {currentDestination.city}</span>
                </h2>
                <span
                  className="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                  style={{
                    background: "#25362F",
                    borderColor: "#426957",
                    color: "#B7E2C9"
                  }}
                >
                  Пример маршрута
                </span>
              </div>

              <div className="space-y-2">
                <div
                  className="flex items-center gap-2 text-xs font-semibold"
                  style={{ color: palette.accent }}
                >
                  <MapPin className="h-4 w-4" />
                  Варианты размещения
                </div>

                {hotelList.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {hotelList.map(hotel => {
                      const isSelected = selectedHotel?.id === hotel.id;

                      return (
                        <button
                          key={hotel.id}
                          onClick={() => updateSelectedHotel(hotel)}
                          className="flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition hover:brightness-110"
                          style={{
                            background: isSelected ? "#303651" : palette.inset,
                            borderColor: isSelected ? palette.accent : palette.border
                          }}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-white">
                              {hotel.name}
                            </span>
                            <span className="mt-1 block text-[10px]" style={{ color: palette.accent }}>
                              {hotel.stars}
                              {hotel.rating !== "—" && hotel.rating != null
                                ? ` • оценка ${hotel.rating}`
                                : ""}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block text-xs font-bold" style={{ color: palette.gold }}>
                              {formatPrice(hotel.price)}
                            </span>
                            <span className="block text-[9px] text-slate-400">
                              {activeChat.trip ? "пример за ночь" : "примерная цена"}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    className="rounded-xl border p-3 text-xs leading-relaxed text-slate-300"
                    style={{ background: palette.inset, borderColor: palette.border }}
                  >
                    ИИ пока не предложил отели. Напиши в чат, чтобы уточнить город или попросить подобрать варианты.
                  </p>
                )}
              </div>

              {selectedHotel && (
                <div
                  className="space-y-3 rounded-xl border p-4"
                  style={{ background: palette.inset, borderColor: palette.border }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="flex items-center gap-1.5 text-xs font-bold"
                      style={{ color: palette.gold }}
                    >
                      <Hotel className="h-4 w-4" />
                      ВЫБРАННЫЙ ОТЕЛЬ
                    </span>
                    <span
                      className="rounded-md border px-2 py-1 text-[10px]"
                      style={{
                        background: palette.card,
                        borderColor: palette.border,
                        color: palette.accent
                      }}
                    >
                      {selectedHotel.stars}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {selectedHotel.name}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-300">
                    {selectedHotel.tags}
                  </p>

                  <div
                    className="space-y-2 rounded-lg border p-3 text-xs leading-relaxed"
                    style={{
                      background: palette.card,
                      borderColor: palette.border
                    }}
                  >
                    <div className="font-bold" style={{ color: palette.gold }}>
                      Почему этот вариант
                    </div>
                    <p className="text-slate-200">{selectedHotel.reason}</p>
                    <div className="flex items-start gap-2 border-t pt-2 text-slate-300" style={{ borderColor: palette.border }}>
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: palette.gold }} />
                      <span>{selectedHotel.risk}</span>
                    </div>
                  </div>
                </div>
              )}

              <div
                className="space-y-2 rounded-xl border p-4"
                style={{ background: palette.inset, borderColor: palette.border }}
              >
                <div className="flex items-center gap-2 text-xs font-bold" style={{ color: palette.accent }}>
                  <Plane className="h-4 w-4" />
                  ПРЕДПОЛАГАЕМЫЙ ПЕРЕЛЁТ
                </div>
                <p className="text-xs font-semibold leading-relaxed text-white">
                  {currentDestination.flight || "Маршрут перелёта пока не указан."}
                </p>
                <p className="text-xs text-slate-300">
                  {currentDestination.flightDate || "Даты поездки нужно уточнить."}
                </p>
                <p className="text-[10px] leading-relaxed text-slate-400">
                  Направление и расписание приведены для примера. Перед покупкой проверь реальные рейсы.
                </p>
              </div>

              {activeChat.hasPet && (
                <div
                  className="flex items-center justify-between gap-2 rounded-xl border p-3 text-xs"
                  style={{
                    background: "#292E43",
                    borderColor: palette.border
                  }}
                >
                  <span className="flex items-center gap-2 text-slate-200">
                    <Dog className="h-4 w-4" style={{ color: palette.accent }} />
                    Поездка с питомцем
                  </span>
                  <span className="font-semibold" style={{ color: palette.gold }}>
                    Условия уточняются
                  </span>
                </div>
              )}

              <div
                className="flex items-center justify-between gap-3 border-t pt-4"
                style={{ borderColor: palette.border }}
              >
                <div className="min-w-0">
                  <span className="block text-xs font-medium text-slate-300">
                    {activeChat.trip ? "Примерный бюджет поездки:" : "Примерная стоимость:"}
                  </span>
                  <span className="mt-1 block text-2xl font-black tracking-tight" style={{ color: palette.gold }}>
                    {formatPrice(
                      activeChat.trip
                        ? (Number(currentDestination.budget) || selectedHotel?.price || 0) +
                          (activeChat.hasPet ? Number(currentDestination.petFee) || 0 : 0)
                        : (Number(selectedHotel?.price) || 0)
                    )}
                  </span>
                  <span className="mt-1 block text-[10px] text-slate-400">
                    Не является подтверждённым предложением
                  </span>
                </div>

                <button
                  onClick={() => {
                    setPostActionNotice("");
                    setShowVoucher(true);
                  }}
                  className="shrink-0 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 shadow-md transition hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #B8B9F5, #E8D4A2)" }}
                >
                  Продолжить
                </button>
              </div>
            </section>
          </aside>
        </main>
      )}

      {showMetricsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div
            className="relative max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl border p-6 shadow-2xl"
            style={{ background: palette.header, borderColor: palette.border }}
          >
            <button
              onClick={() => setShowMetricsModal(false)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-white"
              aria-label="Закрыть метрики"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: palette.border }}>
              <ShieldCheck className="h-6 w-6" style={{ color: palette.accent }} />
              <div>
                <h3 className="pr-6 text-lg font-extrabold text-white">
                  Метрики AI-агента
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Демонстрационный экран проекта
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              {[
                {
                  title: "Ответы ИИ",
                  value: "GigaChat",
                  description: "Модель отвечает на запросы и помогает составлять план поездки."
                },
                {
                  title: "Поддержка направлений",
                  value: "Весь мир",
                  description: "Можно запросить поездку в произвольный город или страну."
                },
                {
                  title: "Подбор отелей",
                  value: "AI-рекомендации",
                  description: "Названия, цены и оценки могут быть демонстрационными."
                },
                {
                  title: "Бронирование",
                  value: "Не подключено",
                  description: "Покупка билетов и оформление реальных бронирований пока не выполняются."
                }
              ].map(item => (
                <div
                  key={item.title}
                  className="space-y-2 rounded-xl border p-4"
                  style={{ background: palette.card, borderColor: palette.border }}
                >
                  <div className="font-bold" style={{ color: palette.accent }}>
                    {item.title}
                  </div>
                  <div className="text-lg font-black text-white">{item.value}</div>
                  <p className="leading-relaxed text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowMetricsModal(false)}
              className="w-full rounded-xl py-3 text-sm font-bold text-slate-900 transition hover:brightness-110"
              style={{ background: palette.accent }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-md space-y-4 rounded-2xl border p-6 text-center shadow-2xl"
            style={{ background: palette.header, borderColor: palette.border }}
          >
            <button
              onClick={() => setShowVoucher(false)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-white"
              aria-label="Закрыть окно"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border"
              style={{
                background: "#29362F",
                borderColor: "#426957",
                color: "#B7E2C9"
              }}
            >
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-extrabold text-white">
              План поездки готов к обсуждению!
            </h3>

            <p className="text-xs leading-relaxed text-slate-300">
              Это демонстрационный проект. Билеты не куплены, отель не забронирован, а ваучер не создан. Перед реальной поездкой нужно проверить цены, наличие мест и условия.
            </p>

            <div
              className="space-y-2 rounded-xl border p-3 text-left"
              style={{ background: palette.card, borderColor: palette.border }}
            >
              <span className="block text-xs font-bold" style={{ color: palette.accent }}>
                Что можно сделать дальше
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowVoucher(false);
                    handleSend("Помоги проверить, какие детали поездки нужно уточнить перед реальным бронированием.");
                  }}
                  className="rounded-lg border p-2 text-xs text-slate-200 transition hover:brightness-110"
                  style={{ background: palette.inset, borderColor: palette.border }}
                >
                  Проверить детали
                </button>
                <button
                  onClick={() => {
                    setShowVoucher(false);
                    handleSend("Предложи более бюджетный вариант моей поездки.");
                  }}
                  className="rounded-lg border p-2 text-xs text-slate-200 transition hover:brightness-110"
                  style={{ background: palette.inset, borderColor: palette.border }}
                >
                  Снизить бюджет
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowVoucher(false);
                setPostActionNotice("");
                goHome();
              }}
              className="w-full rounded-xl py-3 text-sm font-bold text-slate-900 transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #B8B9F5, #E8D4A2)" }}
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
