
import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // In a real app, you'd want to protect this endpoint
    // to ensure only admins can access it.
    const users = getAllUsers();
    // Omit password before sending to client
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error("Failed to get users:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при получении пользователей." },
      { status: 500 }
    );
  }
}
