import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Use the same secret as in .env.local
const JWT_SECRET = process.env.JWT_SECRET || '3f7a8b2c9d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9';

interface JWTPayload {
  userId: number;
  email: string;
  username: string;
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    console.log('Middleware - Token verified successfully:', { 
      userId: payload.userId, 
      email: payload.email 
    });
    
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Middleware - JWT Verification Error:', error instanceof Error ? error.message : error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  console.log('Middleware check:', { 
    path, 
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
  });

  // Check if accessing protected route
  if (path.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      console.log('Invalid token, redirecting to login');
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }
    
    console.log('Token valid, allowing access to dashboard for user:', payload.email);
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (path === '/' && token) {
    const payload = await verifyToken(token);
    if (payload) {
      console.log('User already logged in, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
};
