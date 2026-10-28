import express from "express";
import cors from "cors";
import crypto from "node:crypto";

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_KEY = process.env.GIGACHAT_AUTH_KEY;

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// Кэш токена GigaChat
let cachedToken = null;
let tokenExpiresAt = 0;

// Получение токена авторизации
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  if (!AUTH_KEY) {
    throw new Error(
      "Не задан секрет GIGACHAT_AUTH_KEY в настройках Render."
    );
  }

  const response = await fetch(
    "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${AUTH_KEY}`,
        "RqUID": crypto.randomUUID(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "scope=GIGACHAT_API_PERS",
      signal: AbortSignal.timeout(20000)
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    console.error("GigaChat authorization error:", response.status);
    throw new Error("Не удалось авторизоваться в GigaChat.");
  }

  cachedToken = data.access_token;

  // GigaChat обычно возвращает expires_at в миллисекундах.
  tokenExpiresAt =
    Number(data.expires_at) || Date.now() + 25 * 60 * 1000;

  return cachedToken;
}

// Проверка работы сервера
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "О!дин запрос",
    message: "Сервер работает."
  });
});

// ИИ-помощник для планирования путешествий
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Напиши, куда хочешь отправиться."
      });
    }

    const history = Array.isArray(req.body?.history)
      ? req.body.history.slice(-10)
      : [];

    const currentTrip = req.body?.currentTrip || null;

    const systemPrompt = `
Ты — «О!дин запрос», дружелюбный ИИ-помощник по путешествиям.

Помогай планировать поездки по всему миру: в любую страну,
город или регион. Не ограничивайся заранее заданными направлениями.

Отвечай на русском языке, понятно и доброжелательно.

ПРАВИЛА:
1. Учитывай историю переписки и текущее направление поездки.
2. Если пользователь указал новое направление, используй именно его.
3. Предлагай три подходящих варианта отелей в указанном месте.
4. Названия отелей должны соответствовать направлению и по возможности
   относиться к реально существующим объектам.
5. Можно предложить ориентировочные цены, примерный бюджет и маршрут
   перелёта для демонстрации. Это не проверенные предложения.
6. Не утверждай, что билеты доступны, отели свободны или бронирование
   оформлено, если это не проверено внешним сервисом.
7. Не утверждай, что отель принимает животных, если это неизвестно.
8. Если пользователь просит дешевле, предложи более бюджетные варианты.
9. Если пользователь едет с питомцем, учти это в рекомендациях.
10. Если направления недостаточно для ответа, задай уточняющий вопрос.
11. Если пользователь просто задаёт вопрос, не связанный с изменением
    поездки, ответь на него и по возможности сохрани текущую поездку.
12. Не выдумывай подтверждённые рейтинги, отзывы и условия отелей.
    Если оценка приблизительная, укажи это в ответе.

Верни один корректный JSON без Markdown и без блока кода:

{
  "answer": "Ответ пользователю",
  "trip": {
    "country": "Страна",
    "city": "Город или направление",
    "flight": "Пример маршрута перелёта",
    "flightDate": "Даты или период поездки",
    "budget": 100000,
    "petFee": 0,
    "hotels": [
      {
        "id": "hotel-1",
        "name": "Название отеля",
        "stars": 4,
        "rating": 4,
        "tags": ["Удобное расположение"],
        "price": 5000,
        "reason": "Почему подходит",
        "risk": "Что нужно дополнительно уточнить"
      }
    ]
  }
}

ТРЕБОВАНИЯ К JSON:
- Если направление известно, trip должен содержать данные поездки.
- Если направление неизвестно, можно вернуть "trip": null.
- Для известного направления предложи ровно три отеля.
- price — примерная стоимость одной ночи в рублях, число.
- budget — примерный бюджет поездки в рублях, число.
- petFee — примерная дополнительная стоимость питомца в рублях, число.
- stars — целое число от 1 до 5.
- rating — число от 1 до 5; не представляй его как подтверждённый рейтинг.
- hotels — массив объектов отелей.
- flight, flightDate, country и city — строки.
- Не добавляй поля за пределами указанной структуры.
- Не обещай реальное бронирование или покупку билетов.
`;

    const conversation = history
      .filter(
        (item) =>
          item &&
          typeof item.text === "string" &&
          ["user", "ai", "assistant"].includes(item.sender)
      )
      .map((item) => ({
        role: ["ai", "assistant"].includes(item.sender)
          ? "assistant"
          : "user",
        content: item.text.slice(0, 2000)
      }));

    const contextMessage = `
Текущий контекст поездки:
${JSON.stringify(currentTrip)}

Новое сообщение пользователя:
${message.trim()}

Учитывай предыдущую переписку. Верни JSON строго по заданной структуре.
`;

    const token = await getAccessToken();

    const apiResponse = await fetch(
      "https://api.giga.chat/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          model: "GigaChat-3-Ultra",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...conversation,
            {
              role: "user",
              content: contextMessage
            }
          ],
          temperature: 0.4,
          max_tokens: 1800
        }),
        signal: AbortSignal.timeout(45000)
      }
    );

    const apiData = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error(
        "GigaChat API error:",
        apiResponse.status,
        apiData
      );

      return res.status(502).json({
        error: "GigaChat временно не ответил. Попробуй ещё раз."
      });
    }

    const rawContent = apiData.choices?.[0]?.message?.content;

    if (typeof rawContent !== "string" || !rawContent.trim()) {
      return res.status(502).json({
        error: "ИИ вернул пустой ответ. Попробуй ещё раз."
      });
    }

    let result;

    try {
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const match = cleaned.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("JSON не найден");
      }

      result = JSON.parse(match[0]);
    } catch (error) {
      console.error("Ошибка разбора ответа GigaChat:", error);

      return res.json({
        answer: rawContent,
        trip: null
      });
    }

    let trip = null;

    if (result.trip && typeof result.trip === "object") {
      const sourceTrip = result.trip;

      const hotels = Array.isArray(sourceTrip.hotels)
        ? sourceTrip.hotels.slice(0, 3).map((hotel, index) => ({
            id: String(hotel.id || `hotel-${index + 1}`),
            name: String(hotel.name || "Вариант размещения"),
            stars: Math.max(
              1,
              Math.min(5, Math.round(Number(hotel.stars) || 3))
            ),
            rating: Math.max(
              1,
              Math.min(5, Number(hotel.rating) || 4)
            ),
            tags: Array.isArray(hotel.tags)
              ? hotel.tags.map(String).slice(0, 5)
              : [],
            price: Math.max(0, Number(hotel.price) || 0),
            reason: String(hotel.reason || ""),
            risk: String(
              hotel.risk ||
              "Уточни актуальную цену и условия размещения."
            )
          }))
        : [];

      trip = {
        country: String(sourceTrip.country || ""),
        city: String(sourceTrip.city || ""),
        flight: String(
          sourceTrip.flight ||
          "Маршрут и стоимость перелёта требуют уточнения."
        ),
        flightDate: String(
          sourceTrip.flightDate || "Даты не указаны"
        ),
        budget: Math.max(0, Number(sourceTrip.budget) || 0),
        petFee: Math.max(0, Number(sourceTrip.petFee) || 0),
        hotels
      };
    }

    return res.json({
      answer: String(
        result.answer || "Давай подберём подходящий вариант поездки."
      ),
      trip
    });
  } catch (error) {
    console.error("Ошибка обработки чата:", error);

    return res.status(500).json({
      error:
        "Не удалось обработать запрос. Проверь подключение и попробуй ещё раз."
    });
  }
});

app.listen(PORT, () => {
  console.log(`О!дин запрос запущен на порту ${PORT}`);
});
