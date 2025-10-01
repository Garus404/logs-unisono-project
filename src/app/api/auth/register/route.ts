import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser, hashPassword, setVerificationCode, generateVerificationCode } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

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
      return NextResponse.json({ 
        success: true, 
        message: "Аккаунт создан, но не удалось отправить код подтверждения. Свяжитесь с администратором.",
        verificationSent: false
      });
    }

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
