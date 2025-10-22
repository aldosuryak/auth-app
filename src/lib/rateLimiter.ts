import { query } from './db';

interface LoginAttempt {
  id: number;
  ip_address: string;
  attempt_time: Date;
}

export async function checkRateLimit(
  ipAddress: string,
  maxAttempts: number = 5,
  windowMinutes: number = 1
): Promise<{ allowed: boolean; remainingTime?: number }> {
  const sql = `
    SELECT COUNT(*) as count 
    FROM login_attempts 
    WHERE ip_address = ? 
    AND attempt_time > DATE_SUB(NOW(), INTERVAL ? MINUTE)
  `;
  
  const result = await query<Array<{ count: number }>>(sql, [
    ipAddress,
    windowMinutes
  ]);
  
  const attemptCount = result[0].count;
  
  if (attemptCount >= maxAttempts) {
    // Get oldest attempt to calculate remaining time
    const oldestSql = `
      SELECT attempt_time 
      FROM login_attempts 
      WHERE ip_address = ? 
      ORDER BY attempt_time ASC 
      LIMIT 1
    `;
    const oldestResult = await query<Array<{ attempt_time: Date }>>(
      oldestSql,
      [ipAddress]
    );
    
    if (oldestResult.length > 0) {
      const oldestTime = new Date(oldestResult[0].attempt_time);
      const expiryTime = new Date(
        oldestTime.getTime() + windowMinutes * 60 * 1000
      );
      const remainingTime = Math.ceil(
        (expiryTime.getTime() - Date.now()) / 1000
      );
      
      return { allowed: false, remainingTime };
    }
  }
  
  return { allowed: true };
}

export async function recordLoginAttempt(
  ipAddress: string,
  email: string | null,
  success: boolean
): Promise<void> {
  const sql = `
    INSERT INTO login_attempts (ip_address, email, success) 
    VALUES (?, ?, ?)
  `;
  await query(sql, [ipAddress, email, success]);
}