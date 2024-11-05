import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export { default } from 'next-auth/middleware'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })  // Get the token from the request

    const path = request.nextUrl.pathname  // Get the current path of the request

    // If the user has a token (logged in)
    if (token) {
        // Redirect from /signup, /verify, or /signin to /dashboard
        if (path.startsWith('/signup') || path.startsWith('/verify') || path.startsWith('/sign-in')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    } else {
        // If there's no token (user not logged in)
        // Allow access to /signin, /signup, /verify, and home page (/)
        if (path === '/' || path.startsWith('/sign-in') || path.startsWith('/signup') || path.startsWith('/verify')) {
            return NextResponse.next()  // Allow access to these pages
        } else {
            // Redirect any other pages to /signin
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
    }

    return NextResponse.next()
}

// Updated config with correct matcher pattern
export const config = {
    matcher: [
        '/', 
        '/signin', 
        '/signup', 
        '/verify/:path*', 
        '/dashboard/:path*'
    ],
}
