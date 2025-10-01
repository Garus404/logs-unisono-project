import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'database.json');

interface User {
  id: string;
  email: string;
  login: string;
  password: string;
  createdAt: string;
  lastLogin: string;
  ip: string;
  userAgent: string;
  cookies?: string;
}

interface Database {
  users: User[];
}

// Чтение базы данных
export function readDB(): Database {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty structure
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { users: [] };
    }
    // For other errors, we might still want to return a default structure
    // or re-throw, depending on the desired behavior.
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
    lastLogin: new Date().toISOString()
  };

  db.users.push(user);
  writeDB(db);
  
  return user;
}

// Обновление lastLogin
export function updateLastLogin(userId: string, ip: string, userAgent: string, cookies?: string): void {
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  
  if (user) {
    user.lastLogin = new Date().toISOString();
    user.ip = ip;
    user.userAgent = userAgent;
    if (cookies) user.cookies = cookies;
    writeDB(db);
  }
}

// Хэширование пароля
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

// Проверка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
