
import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser } from "@/lib/db";

// Функция для отправки уведомлений в Telegram
async function sendToTelegramAPI(message: string): Promise<void> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram bot token or chat ID is not configured.");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "HTML",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!result.ok) {
      console.error("Telegram API Error:", result.description);
    }
  } catch (error) {
    console.error("Failed to send message to Telegram:", error);
  }
}

export async function POST(request: Request) {
  try {
    const { email, login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!email || !login || !password) {
        return NextResponse.json({ error: "Email, логин и пароль обязательны" }, { status: 400 });
    }

    // Проверка на существование
    if (isEmailOrLoginTaken(email, login)) {
      return NextResponse.json(
        { error: "Email или логин уже заняты" },
        { status: 400 }
      );
    }

    // Создаем пользователя
    const newUser = await createUser({
      email,
      login,
      password: password, // Store password in plaintext
      ip: clientIP,
      userAgent: userAgent
    });

    // Отправляем уведомление в Telegram о новой регистрации
    const telegramMessage = `
🆕 <b>Новая регистрация</b>
<b>Пользователь:</b> ${login} (<code>${email}</code>)
<b>Требуется подтверждение администратора.</b>
<b>IP:</b> <code>${clientIP}</code>
<b>User-Agent:</b> ${userAgent}
<b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
`;
    await sendToTelegramAPI(telegramMessage);


    return NextResponse.json({ 
      success: true, 
      message: "Регистрация прошла успешно. Ожидайте подтверждения администратором."
    });

  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
