// app/api/auth/resend-verification/route.ts
import { NextResponse } from "next/server";
import { findUserByEmail, setVerificationCode, generateVerificationCode, getVerificationCode } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email обязателен" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "Email уже подтвержден" }, { status: 400 });
    }

    // Проверяем есть ли активный код
    let verificationCode = getVerificationCode(email);
    
    // Если нет активного кода - генерируем новый
    if (!verificationCode) {
      verificationCode = generateVerificationCode();
      setVerificationCode(user.id, verificationCode);
    }

    // Отправляем email
    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent) {
      return NextResponse.json({ error: "Не удалось отправить email" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Код подтверждения отправлен на email" 
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}