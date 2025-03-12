import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId, sessionClaims } = await auth()
    
    // If accessing a protected route
    if (isProtectedRoute(req)) {
      // Case 1: User is not logged in
      if (!userId) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      
      // Case 2: User is logged in but doesn't have admin role
      const userRole = sessionClaims?.publicMetadata?.role
      if (userRole !== 'admin') {
        console.log(`Access denied: User ${userId} with role ${userRole} attempted to access ${req.url}`)
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    
    // Allow the user to continue
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware auth error:', error)
    // Fallback for any errors - redirect to home page
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}