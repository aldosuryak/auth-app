import jwt, { SignOptions, Secret} from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = (`7d`);

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
}

export function generateToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
