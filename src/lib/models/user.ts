import { query } from '../db';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const sql = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
  const results = await query<User[]>(sql, [email]);
  return results.length > 0 ? results[0] : null;
}

export async function findUserByUsername(
  username: string
): Promise<User | null> {
  const sql = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
  const results = await query<User[]>(sql, [username]);
  return results.length > 0 ? results[0] : null;
}

export async function findUserById(id: number): Promise<User | null> {
  const sql = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
  const results = await query<User[]>(sql, [id]);
  return results.length > 0 ? results[0] : null;
}

export async function createUser(
  username: string,
  email: string,
  passwordHash: string
): Promise<User> {
  const sql = `
    INSERT INTO users (username, email, password_hash) 
    VALUES (?, ?, ?)
  `;
  const result: any = await query(sql, [username, email, passwordHash]);
  
  const newUser = await findUserById(result.insertId);
  if (!newUser) {
    throw new Error('Failed to create user');
  }
  
  return newUser;
}