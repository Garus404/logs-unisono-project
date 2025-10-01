
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { User, UserPermission } from './types';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'database.json');

interface Database {
  users: User[];
}

// Чтение базы данных
export function readDB(): Database {
  try {
    if (!fs.existsSync(dbPath)) {
        writeDB({ users: [] });
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database, returning empty structure:", error);
    return { users: [] };
  }
}

// Запись в базу данных
export function writeDB(data: Database): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Поиск пользователя по email или login
export function findUser(emailOrLogin: string): User | undefined {
  const db = readDB();
  return db.users.find(user => 
    user.email === emailOrLogin || user.login === emailOrLogin
  );
}

// Поиск пользователя по ID
export function findUserById(id: string): User | undefined {
    const db = readDB();
    return db.users.find(user => user.id === id);
}

// Получение всех пользователей
export function getAllUsers(): Omit<User, 'password'>[] {
    const db = readDB();
    return db.users.map(({ password, ...user }) => user);
}

// Проверка существования email или login
export function isEmailOrLoginTaken(email: string, login: string): boolean {
  const db = readDB();
  return db.users.some(user => 
    user.email === email || user.login === login
  );
}

// Создание пользователя
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
  const db = readDB();
  
  const user: User = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: {
        viewConsole: false
    }
  };

  db.users.push(user);
  writeDB(db);
  
  return user;
}

// Обновление lastLogin
export function updateLastLogin(userId: string, ip: string, userAgent: string): void {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    db.users[userIndex].lastLogin = new Date().toISOString();
    db.users[userIndex].ip = ip;
    db.users[userIndex].userAgent = userAgent;
    writeDB(db);
  }
}

// Обновление разрешений
export function updateUserPermissions(userId: string, permissions: UserPermission): User | null {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        db.users[userIndex].permissions = {
            ...db.users[userIndex].permissions,
            ...permissions
        };
        writeDB(db);
        const { password, ...updatedUser } = db.users[userIndex];
        return updatedUser;
    }
    return null;
}

// Хэширование пароля
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

// Проверка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
