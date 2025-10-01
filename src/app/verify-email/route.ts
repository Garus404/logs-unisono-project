
import { NextResponse } from "next/server";
import { verifyEmailCode } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email и код обязательны" }, { status: 400 });
    }

    const verified = verifyEmailCode(email, code);

    if (!verified) {
      return NextResponse.json({ error: "Неверный код или срок действия истек" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Email успешно подтвержден. Теперь ожидайте одобрения администратором." 
    });

  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
