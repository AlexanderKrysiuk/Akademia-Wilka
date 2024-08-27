export { auth as middleware } from "@/auth" 

{/* 
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import authConfig from "./auth.config"; // Załóżmy, że eksportujesz swój obiekt konfiguracyjny
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

// Pobierz sekret z obiektu konfiguracyjnego
const secret = authConfig.secret;

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { nextUrl } = req;
  const isLoggedIn = !!token;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  // Skip API routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  
  // Handle authentication routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect to default login redirect if already logged in
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }
  
  // Handle protected routes
  if (!isLoggedIn && !isPublicRoute) {
    // Redirect to login page if user is not logged in and the route is not public
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Include all protected routes
    '/dashboard/:path*',  // Example protected route, adjust as needed
    '/profile/:path*'     // Example protected route, adjust as needed
  ],
};

*/}