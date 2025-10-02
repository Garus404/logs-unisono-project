import { NextResponse } from "next/server";

// 📤 Функция отправки уведомления о входе на сайт
async function sendVisitNotification(ip: string, userAgent: string, referer?: string) {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('⚠️ Переменные окружения для Telegram не установлены.');
      return;
    }

    const message = `
🌐 НОВЫЙ ПОСЕТИТЕЛЬ НА САЙТЕ

📊 **Информация о посещении:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent}
🖥️ Платформа: ${userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'Mac' : userAgent.includes('Linux') ? 'Linux' : 'Unknown'}
🔍 Браузер: ${userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : userAgent.includes('Edge') ? 'Edge' : userAgent.includes('Opera') ? 'Opera' : 'Unknown'}
${referer ? `🔗 Referer: ${referer}` : ''}

🚩 **Статус:** АНОНИМНЫЙ ПОСЕТИТЕЛЬ
    `;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });

    console.log('✅ Уведомление о посещении отправлено в Telegram');

  } catch (error) {
    console.log('⚠️ Ошибка отправки уведомления в Telegram:', error);
  }
}

export async function POST(request: Request) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || 'unknown';

    // Отправляем уведомление в Telegram
    await sendVisitNotification(clientIP, userAgent, referer);

    return NextResponse.json({ 
      success: true,
      message: "Уведомление отправлено"
    });

  } catch (error) {
    console.error("Visit Notification Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}