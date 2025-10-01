
import { NextResponse } from "next/server";
import { updateUser, findUserById, isEmailOrLoginTaken, hashPassword } from "@/lib/db";
import type { User, UserPermission } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body: { permissions?: Partial<UserPermission>, isVerified?: boolean, login?: string, password?: string } = await request.json();

    // In a real app, you'd protect this endpoint
    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден." },
        { status: 404 }
      );
    }
    
    const dataToUpdate: Partial<User> = {};
    const allowedPermissions: (keyof UserPermission)[] = ['viewConsole', 'editPlayers'];

    if (body.permissions) {
        dataToUpdate.permissions = user.permissions || {};
        for (const key in body.permissions) {
            if (allowedPermissions.includes(key as keyof UserPermission)) {
                dataToUpdate.permissions[key as keyof UserPermission] = body.permissions[key as keyof UserPermission];
            }
        }
    }
    
    if (body.isVerified !== undefined) {
        dataToUpdate.isVerified = body.isVerified;
    }

    if (body.login && body.login !== user.login) {
        if (isEmailOrLoginTaken(user.email, body.login)) {
            return NextResponse.json({ error: "Этот логин уже занят." }, { status: 400 });
        }
        dataToUpdate.login = body.login;
    }
    
    if (body.password) {
        dataToUpdate.password = await hashPassword(body.password);
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

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    if (user.login === "Intercom") {
        return NextResponse.json({ error: "Невозможно удалить главного администратора" }, { status: 403 });
    }

    const deleted = deleteUser(userId);

    if (deleted) {
      return NextResponse.json({ success: true, message: "Пользователь удален" });
    } else {
      return NextResponse.json({ error: "Не удалось удалить пользователя" }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
