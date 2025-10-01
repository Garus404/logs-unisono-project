
import { NextResponse } from "next/server";
import { findUserById, updateUser } from "@/lib/db";
import type { User, UserPermission } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body: { permissions?: Partial<UserPermission>, isVerified?: boolean } = await request.json();

    // In a real app, you'd protect this endpoint
    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден." },
        { status: 404 }
      );
    }
    
    const dataToUpdate: Partial<{ permissions: Partial<UserPermission>, isVerified: boolean }> = {};
    const allowedPermissions: (keyof UserPermission)[] = ['viewConsole', 'editPlayers'];

    if (body.permissions) {
        dataToUpdate.permissions = {};
        for (const key in body.permissions) {
            if (allowedPermissions.includes(key as keyof UserPermission)) {
                dataToUpdate.permissions[key as keyof UserPermission] = body.permissions[key as keyof UserPermission];
            }
        }
    }
    
    if (body.isVerified !== undefined) {
        dataToUpdate.isVerified = body.isVerified;
    }


    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ error: "Не указаны корректные данные для обновления." }, { status: 400 });
    }

    const updatedUser = updateUser(userId, dataToUpdate);

    if (!updatedUser) {
       return NextResponse.json({ error: "Не удалось обновить пользователя." }, { status: 500 });
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера." },
      { status: 500 }
    );
  }
}
