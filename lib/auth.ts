import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import { NewUser, User } from './schema';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(userData: Omit<NewUser, 'password'> & { password: string }): Promise<User> {
  const hashedPassword = await hashPassword(userData.password);
  
  const [user] = await db.insert(users).values({
    ...userData,
    password: hashedPassword,
  }).returning();
  
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) return null;
  
  return user;
}

export function generateToken(user: User): string {
  // Simple token generation - in production, use a proper JWT library
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token: string): { id: number; email: string; role: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}
