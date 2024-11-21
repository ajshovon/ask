// middleware.ts
import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathName = new URL(request.url).pathname;

  // Redirect to login if no token and not already on login page
  if (!token && pathName !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    if (token) {
      const decodedToken: { exp?: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // If token is expired, delete the token cookie and redirect to login
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }

      // If token is valid and user is on login page, redirect to /links
      if (pathName === '/login') {
        return NextResponse.redirect(new URL('/messages', request.url));
      }
    }
  } catch (error) {
    console.log('Error decoding token');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow request to continue if token is valid
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/messages', '/settings'],
};
