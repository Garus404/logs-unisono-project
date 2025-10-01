
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

// Поиск пользователя по email
export function findUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find(user => user.email === email);
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
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'verificationCode' | 'verificationCodeExpires' | 'isVerified' | 'emailVerified'>): Promise<User> {
  const db = readDB();
  
  const user: User = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: {
        viewConsole: false,
        editPlayers: false,
    },
    emailVerified: false, // New users have not verified their email
    isVerified: false, // New users are not admin-approved
    verificationCode: undefined,
    verificationCodeExpires: undefined
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

// Обновление разрешений и статуса верификации
export function updateUser(userId: string, data: Partial<{ permissions: Partial<UserPermission>, isVerified: boolean }>): User | null {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        if (data.permissions) {
            db.users[userIndex].permissions = {
                ...db.users[userIndex].permissions,
                ...data.permissions
            };
        }
        if (data.isVerified !== undefined) {
             db.users[userIndex].isVerified = data.isVerified;
        }
        writeDB(db);
        const { password, ...updatedUser } = db.users[userIndex];
        return updatedUser;
    }
    return null;
}

// Удаление пользователя
export function deleteUser(userId: string): boolean {
    const db = readDB();
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== userId);
    
    if (db.users.length < initialLength) {
        writeDB(db);
        return true;
    }
    return false;
}

// Хэширование пароля
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

// Проверка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// 🔐 Функции для подтверждения email

// Генерация кода подтверждения (6 цифр)
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Сохранение кода подтверждения
export function setVerificationCode(userId: string, code: string): void {
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  
  if (user) {
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 часа
    user.emailVerified = false; // Reset email verification status on new code
    writeDB(db);
  }
}

// Проверка кода подтверждения
export function verifyEmailCode(email: string, code: string): boolean {
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  
  if (user && user.verificationCode === code && user.verificationCodeExpires) {
    const now = new Date();
    const expires = new Date(user.verificationCodeExpires);
    
    if (now < expires) {
      user.emailVerified = true; // Only set email verification to true
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      writeDB(db);
      return true;
    }
  }
  
  return false;
}

// Отправка кода подтверждения повторно
export function getVerificationCode(email: string): string | null {
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  
  if (user && user.verificationCode && user.verificationCodeExpires) {
    const now = new Date();
    const expires = new Date(user.verificationCodeExpires);
    
    if (now < expires) {
      return user.verificationCode;
    }
  }
  
  return null;
}
