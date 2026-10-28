import express from "express";
import cors from "cors";
import crypto from "node:crypto";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

const PORT = process.env.PORT || 3000;
const AUTH_KEY = process.env.GIGACHAT_AUTH_KEY;

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (!AUTH_KEY) {
    throw new Error("Не задан GIGACHAT_AUTH_KEY в Render");
  }

  console.log("[AUTH] Запрашиваем токен GigaChat");

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
      signal: AbortSignal.timeout(20000),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("[AUTH] Ошибка получения токена:", response.status);
    console.error("[AUTH] Ответ:", responseText.slice(0, 500));
    throw new Error(`Ошибка авторизации GigaChat: HTTP ${response.status}`);
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error("GigaChat вернул некорректный ответ авторизации");
  }

  if (!data.access_token) {
    throw new Error("В ответе GigaChat отсутствует access_token");
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + 25 * 60 * 1000;

  console.log("[AUTH] Токен получен");

  return cachedToken;
}

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "O!дин запрос API",
  });
});

app.post("/api/chat", async (req, res) => {
  console.log("[CHAT] Получен запрос к /api/chat");

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

    console.log("[CHAT] Отправляем запрос в модель");

    const response = await fetch(
      "https://api.giga.chat/v1/chat/completions",
      {
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
                "Ты — «О!дин запрос», дружелюбный ИИ-помощник по планированию путешествий. " +
                "Помогай понять пожелания пользователя, уточняй самое важное: " +
                "город отправления, даты, бюджет, состав путешественников и интересы. " +
                "Предлагай направления и объясняй компромиссы. " +
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
        signal: AbortSignal.timeout(45000),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("[CHAT] Ошибка модели, HTTP:", response.status);
      console.error("[CHAT] Ответ модели:", responseText.slice(0, 1000));

      if (response.status === 401 || response.status === 403) {
        return res.status(502).json({
          error:
            "GigaChat отклонил запрос. Проверь авторизацию, доступ к модели и настройки API.",
        });
      }

      return res.status(502).json({
        error: `GigaChat вернул ошибку HTTP ${response.status}. Проверь логи Render.`,
      });
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("GigaChat вернул некорректный ответ");
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      console.error("[CHAT] В ответе нет текста модели");
      return res.status(502).json({
        error: "GigaChat вернул пустой ответ.",
      });
    }

    console.log("[CHAT] Ответ получен успешно");

    return res.json({ answer });
  } catch (error) {
    console.error("[CHAT] Ошибка:", error.message);

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return res.status(504).json({
        error: "GigaChat не ответил вовремя. Попробуй ещё раз.",
      });
    }

    return res.status(500).json({
      error: "Не удалось обработать запрос. Проверь логи сервера.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[START] O!дин запрос API запущен на порту ${PORT}`);
});
