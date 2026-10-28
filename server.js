import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const AUTH_KEY = process.env.GIGACHAT_AUTH_KEY;

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (!AUTH_KEY) {
    throw new Error("Не задан GIGACHAT_AUTH_KEY");
  }

  const response = await fetch(
    "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${AUTH_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        RqUID: crypto.randomUUID(),
      },
      body: new URLSearchParams({
        scope: "GIGACHAT_API_PERS",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Ошибка авторизации GigaChat:", response.status);
    throw new Error("Не удалось авторизоваться в GigaChat");
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + 25 * 60 * 1000;

  return cachedToken;
}

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "O!дин запрос API" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Напиши, какую поездку хочешь спланировать.",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Сообщение слишком длинное. Сократи его до 4000 символов.",
      });
    }

    const token = await getAccessToken();

    const response = await fetch("https://api.giga.chat/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: "GigaChat",
        messages: [
          {
            role: "system",
            content:
              "Ты — О!дин запрос, дружелюбный ИИ-помощник по планированию путешествий. " +
              "Помогай понять пожелания пользователя, уточняй только самое важное: " +
              "откуда он едет, даты, бюджет, состав путешественников и интересы. " +
              "Предлагай подходящие направления и объясняй компромиссы. " +
              "Отвечай на русском языке, структурированно и понятно. " +
              "Не выдумывай актуальные цены, наличие билетов, отелей или бронирования. " +
              "Если данных нет, честно скажи об этом. Задавай не более двух вопросов за раз.",
          },
          {
            role: "user",
            content: message.trim(),
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Ошибка GigaChat:", response.status);
      return res.status(502).json({
        error: "GigaChat пока не смог ответить. Попробуй ещё раз.",
      });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({
        error: "GigaChat вернул пустой ответ. Попробуй ещё раз.",
      });
    }

    res.json({ answer });
  } catch (error) {
    console.error("Ошибка сервера:", error.message);
    res.status(500).json({
      error: "Не удалось обработать запрос. Проверь настройки сервера.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`O!дин запрос API запущен на порту ${PORT}`);
});
