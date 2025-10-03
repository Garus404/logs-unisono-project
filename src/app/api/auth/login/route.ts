
import { NextResponse } from "next/server";
import { findUser, verifyPassword, recordLoginHistory, updateUser } from "@/lib/db";
import type { User } from "@/lib/types";

// Функция для отправки уведомлений в Telegram (безопасная версия)
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
    const { login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!login || !password) {
        return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 });
    }

    // Ищем пользователя
    const user = findUser(login);
    if (!user) {
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 400 }
      );
    }

    // Проверяем пароль
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 400 }
      );
    }

    // Проверяем подтверждение учетной записи
    if (!user.isVerified) {
      return NextResponse.json(
          { error: "Ваша учетная запись ожидает подтверждения администратором." },
          { status: 403 }
      );
    }

    // Обновляем lastLogin и логируем событие
    recordLoginHistory(user.id, 'login', clientIP, userAgent);
    
    // Безопасно отправляем уведомление в Telegram
    const telegramMessage = `
✅ <b>Вход в систему</b>
<b>Пользователь:</b> ${user.login} (<code>${user.email}</code>)
<b>IP:</b> <code>${clientIP}</code>
<b>User-Agent:</b> ${userAgent}
<b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
`;
    await sendToTelegramAPI(telegramMessage);
    
    // Обновляем флаг экспорта (если нужно)
    if (!user.passwordExported) {
        updateUser(user.id, { passwordExported: true });
    }


    return NextResponse.json({ 
      success: true, 
      user: { 
        login: user.login,
        email: user.email
      } 
    });

  } catch (error) {
     console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
