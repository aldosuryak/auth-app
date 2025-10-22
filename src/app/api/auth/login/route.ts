import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, findUserByUsername } from '@/lib/models/user';
import { comparePassword, generateToken } from '@/lib/auth';
import { checkRateLimit, recordLoginAttempt } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  console.log('\n=== LOGIN API START ===');
  
  try {
    const body = await request.json();
    const { emailOrUsername, password } = body;

    console.log('1. Request received:', { emailOrUsername });

    // Validasi input
    if (!emailOrUsername || !password) {
      console.log('2. Validation failed: missing fields');
      return NextResponse.json(
        { error: 'Email/Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    console.log('2. Validation passed');

    // Get IP address
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    console.log('3. IP Address:', ipAddress);

    // Check rate limit
    const rateLimit = await checkRateLimit(ipAddress);
    console.log('4. Rate limit check:', { allowed: rateLimit.allowed });
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login. Coba lagi dalam ${rateLimit.remainingTime} detik.`
        },
        { status: 429 }
      );
    }

    // Find user by email or username
    const isEmail = emailOrUsername.includes('@');
    console.log('5. Searching user by:', isEmail ? 'email' : 'username');
    
    const user = isEmail
      ? await findUserByEmail(emailOrUsername)
      : await findUserByUsername(emailOrUsername);

    console.log('6. User found:', !!user);

    if (!user) {
      console.log('7. User not found, recording failed attempt');
      await recordLoginAttempt(ipAddress, emailOrUsername, false);
      return NextResponse.json(
        { error: 'Email/Username atau Password salah' },
        { status: 401 }
      );
    }

    console.log('7. User data:', { id: user.id, email: user.email, username: user.username });

    // Verify password
    console.log('8. Verifying password...');
    const isPasswordValid = await comparePassword(password, user.password_hash);
    console.log('9. Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('10. Password invalid, recording failed attempt');
      await recordLoginAttempt(ipAddress, user.email, false);
      return NextResponse.json(
        { error: 'Email/Username atau Password salah' },
        { status: 401 }
      );
    }

    // Record successful login
    console.log('10. Recording successful login...');
    await recordLoginAttempt(ipAddress, user.email, true);

    // Generate JWT token
    console.log('11. Generating JWT token...');
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    console.log('12. Token generated:', !!token);
    console.log('    Token length:', token?.length);
    console.log('    Token preview:', token ? token.substring(0, 50) + '...' : 'NONE');

    // Create response with HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });

    // Set cookie with proper configuration
    console.log('13. Setting cookie...');
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/', // IMPORTANT: Cookie available for all paths
    });

    console.log('14. Cookie set successfully');
    console.log('=== LOGIN API END - SUCCESS ===\n');

    return response;
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('=== LOGIN API END - ERROR ===\n');
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
