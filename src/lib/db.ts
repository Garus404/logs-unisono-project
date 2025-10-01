

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { User, UserPermission, LoginHistoryEntry } from './types';

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
export function getAllUsers(): User[] {
    const db = readDB();
    // Return the full user object, password will be omitted by the API route
    return db.users;
}


// Проверка существования email или login
export function isEmailOrLoginTaken(email: string, login: string): boolean {
  const db = readDB();
  return db.users.some(user => 
    user.email === email || user.login === login
  );
}

// Создание пользователя
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'isVerified' | 'permissions' | 'loginHistory'>): Promise<User> {
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
    isVerified: false, // New users are not admin-approved
    loginHistory: [],
  };

  db.users.push(user);
  writeDB(db);
  
  return user;
}

export function recordLoginHistory(userId: string, type: 'login' | 'logout', ip: string, userAgent: string): void {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    const newLogEntry: LoginHistoryEntry = {
      type,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
    };

    if (!db.users[userIndex].loginHistory) {
      db.users[userIndex].loginHistory = [];
    }

    // Add new entry and keep only the last 20 entries
    db.users[userIndex].loginHistory = [newLogEntry, ...db.users[userIndex].loginHistory!].slice(0, 20);

    // Also update lastLogin for login events
    if (type === 'login') {
        db.users[userIndex].lastLogin = newLogEntry.timestamp;
        db.users[userIndex].ip = ip;
        db.users[userIndex].userAgent = userAgent;
    }
    
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
