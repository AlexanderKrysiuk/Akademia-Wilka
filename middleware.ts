import { NextRequest, NextResponse } from "next/server"
import { getToken } from 'next-auth/jwt'; // Funkcja do uzyskania tokenu JWT z requestu

import NextAuth from "next-auth";

import { apiAuthPrefix, apiPrefix, authRoutes, coursePrefix, courseprefix, publicRoutes, teacherPrefix, userRoutes } from "./routes";
import { UserRole } from "@prisma/client";
import { getUserByEmail } from "./data/user";
import { useCurrentUser } from "./hooks/user";
import { useSession } from "next-auth/react";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig)

export default auth((request) => {
    
  const isLoggedIn = !!request.auth
  //console.log("loggedin?:", isLoggedIn) 
  const user = request.auth?.user  
  //console.log("middleware user:", user)
  
  //console.log("LOGGEDIN?:", isLoggedIn )
  //console.log("USER:", user)
  //console.log("ROUTE:" ,request.nextUrl.pathname)
  //console.log("running")
  //const apiAuthRoute = apiAuthPrefix.startsWith(request.nextUrl.pathname)
  const apiRoute = request.nextUrl.pathname.startsWith(apiPrefix)
  if (apiRoute) {
    return NextResponse.next()
  }

  const authRoute = authRoutes.includes(request.nextUrl.pathname)
  if (authRoute) {
    if (user) {
      return NextResponse.redirect(new URL("/kokpit", request.nextUrl))
    }
    return NextResponse.next()
  }

  const userRoute = userRoutes.includes(request.nextUrl.pathname)
  if (userRoute) {
    if (user) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/auth/start", request.nextUrl))
  }

  const teacherRoute = request.nextUrl.pathname.startsWith(teacherPrefix)
  if (teacherRoute) {
    if (user?.role?.includes(UserRole.Teacher)) {
      //console.log("PASSED")
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/kokpit", request.nextUrl))
  }

  const courseRoute = request.nextUrl.pathname.startsWith(coursePrefix)
  if (courseRoute) {
    return NextResponse.next()
  }
  const courseLearingRoute = request.nextUrl.pathname.startsWith(courseprefix)
  if (courseLearingRoute) {
    return NextResponse.next()
  }
  
  const publicRoute = publicRoutes.includes(request.nextUrl.pathname)
  if (publicRoute) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL("/", request.nextUrl))
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    //'/(api|trpc)(.*)',
  ],
}

{/* 
import { UserRole } from '@prisma/client'
import { auth } from './auth'
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, apiPrefix, authRoutes, basketprefix, courseprefix, publicRoutes, teacherPrefix } from './routes'
import { NextResponse } from 'next/server'
import { NextURL } from 'next/dist/server/web/next-url'

export default auth((req) => {
  const user = req.auth?.user
  const { pathname } = req.nextUrl
  
  const isLoggedIn = !!user
  const isTeacher = user?.roles.includes(UserRole.Teacher)
  
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)
  const isCourseRoute = pathname.startsWith(courseprefix)
  const isApiRoute = pathname.startsWith(apiPrefix)
  const isBasketRoute = pathname.startsWith(basketprefix)
  
  // Zwracaj NextResponse.next() dla API i trpc tras
  if (isApiRoute) {
    return NextResponse.next();
  }
  
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  
  if (isCourseRoute) {
    return NextResponse.next()
  }
  
  if (isBasketRoute) {
    return NextResponse.next()
  }
  
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url))
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", req.url))
  }
  
  if (isLoggedIn && !isTeacher && pathname.startsWith(teacherPrefix)) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url))
  }
  
  //console.log("USER: ",user)
  //console.log("Teacher: ",isTeacher)
  //console.log("Is Logged In", isLoggedIn)
  
  //if(!isLoggedIn && !publicRoutes.includes(pathname)) {
    //  return NextResponse.redirect(new URL("/auth/login", req.url))
    //}
  })
  
  
  export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  
*/}
  
  
  {/* 
export { auth as middleware } from "@/auth" 

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