import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token');

  // Allow all API routes to proceed (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/auth'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no auth token and trying to access protected route, redirect to auth
  if (!authToken) {
    const authUrl = new URL('/auth', request.url);
    return NextResponse.redirect(authUrl);
  }

  // If user is authenticated and trying to access auth page, redirect to appropriate dashboard
  if (pathname === '/auth' && authToken) {
    try {
      const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
      const dashboardUrl = tokenData.role === 'manager' ? '/admin-dashboard' : '/employee-dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    } catch {
      // Invalid token, redirect to auth
      const authUrl = new URL('/auth', request.url);
      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
