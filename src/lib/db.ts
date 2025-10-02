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
    return db.users;
}

// Проверка существования email или login
export function isEmailOrLoginTaken(email?: string, login?: string, excludeUserId?: string): boolean {
  const db = readDB();
  return db.users.some(user => {
    if (excludeUserId && user.id === excludeUserId) {
      return false;
    }
    const emailMatch = email && user.email === email;
    const loginMatch = login && user.login === login;
    return !!(emailMatch || loginMatch);
  });
}

// Создание пользователя
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'isVerified' | 'permissions' | 'loginHistory' | 'passwordExported' >): Promise<User> {
  const db = readDB();
  
  const user: User = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: {
        viewConsole: false,
        editPlayers: false,
        viewPlayers: false,
    },
    isVerified: false,
    loginHistory: [],
    passwordExported: false,
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

    db.users[userIndex].loginHistory = [newLogEntry, ...db.users[userIndex].loginHistory!].slice(0, 20);

    if (type === 'login') {
        db.users[userIndex].lastLogin = newLogEntry.timestamp;
        db.users[userIndex].ip = ip;
        db.users[userIndex].userAgent = userAgent;
    }
    
    writeDB(db);
  }
}

// Обновление данных пользователя
export function updateUser(userId: string, data: Partial<User>): User | null {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        db.users[userIndex] = {
            ...db.users[userIndex],
            ...data
        };
        writeDB(db);
        return db.users[userIndex];
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
