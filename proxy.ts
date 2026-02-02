import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "@/lib/cookie";

const publicRoutes = ['/login', '/register', '/forget-password', '/reset-password'];
const adminRoutes = ['/admin'];
const userRoutes = ['/user'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    try {
        // ✅ Can use async in proxy.ts
        const token = await getAuthToken();
        const user = token ? await getUserData() : null;

        // Check route types
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
        const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
        const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
        
        console.log(`[Proxy] Route check:`, {
            pathname,
            hasToken: !!token,
            hasUser: !!user,
            userRole: user?.role,
            isPublicRoute,
            isAdminRoute,
            isUserRoute
        });

        // 1. Redirect to login if accessing protected routes without token
        if (!token && !isPublicRoute) {
            console.log(`[Proxy] Redirecting to /login - no token for: ${pathname}`);
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // 2. If user exists, check role-based access
        if (token && user) {
            // Admin route protection
            if (isAdminRoute && user.role !== 'admin') {
                console.log(`[Proxy] Redirecting to / - non-admin accessing admin route`);
                return NextResponse.redirect(new URL('/', request.url));
            }
            
            // User route protection (both 'user' and 'admin' can access)
            if (isUserRoute && user.role !== 'user' && user.role !== 'admin') {
                console.log(`[Proxy] Redirecting to / - unauthorized role for user route`);
                return NextResponse.redirect(new URL('/', request.url));
            }
        }

        // 3. Redirect authenticated users away from public auth pages
        if (isPublicRoute && token && user) {
            console.log(`[Proxy] Redirecting to / - authenticated user accessing public route`);
            return NextResponse.redirect(new URL('/', request.url));
        }

        console.log(`[Proxy] Access granted for: ${pathname}`);
        return NextResponse.next();
        
    } catch (error) {
        console.error('[Proxy] Error:', error);
        // On error, redirect to login for safety
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/user/:path*',
        '/login',
        '/register',
        '/forget-password',
        '/reset-password'
    ]
};
