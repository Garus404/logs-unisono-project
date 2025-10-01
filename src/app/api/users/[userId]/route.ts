
import { NextResponse } from "next/server";
import { findUserById, updateUserPermissions } from "@/lib/db";
import type { UserPermission } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body: Partial<UserPermission> = await request.json();

    // Again, you would protect this in a real app
    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден." },
        { status: 404 }
      );
    }
    
    // Allow only specific permissions to be updated
    const allowedPermissions: (keyof UserPermission)[] = ['viewConsole', 'editPlayers'];
    const permissionsToUpdate: Partial<UserPermission> = {};

    for (const key in body) {
        if (allowedPermissions.includes(key as keyof UserPermission)) {
            permissionsToUpdate[key as keyof UserPermission] = body[key as keyof UserPermission];
        }
    }

    if (Object.keys(permissionsToUpdate).length === 0) {
        return NextResponse.json({ error: "Не указаны корректные разрешения для обновления." }, { status: 400 });
    }

    const updatedUser = updateUserPermissions(userId, permissionsToUpdate);

    if (!updatedUser) {
       return NextResponse.json({ error: "Не удалось обновить разрешения." }, { status: 500 });
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Failed to update user permissions:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера." },
      { status: 500 }
    );
  }
}
