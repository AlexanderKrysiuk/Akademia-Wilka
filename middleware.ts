import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Zakładam, że masz tutaj auth()

export async function middleware(req: NextRequest) {
    const session = await auth();
    const path = req.nextUrl.pathname
    // Jeśli użytkownik jest zalogowany i próbuje wejść na stronę logowania
    if (session && path.includes("/auth/start")) {
        // Przekierowanie na stronę główną lub inną
        return NextResponse.redirect(new URL("/", req.url)); // Przekierowanie na stronę główną
    }

    // Sprawdzamy, czy użytkownik próbuje uzyskać dostęp do strony /nauczyciel
    if (path.startsWith("/nauczyciel")) {
      // Sprawdzamy, czy użytkownik jest zalogowany i ma odpowiednią rolę
      if (!session || session.user.role !== "Admin") {
          return NextResponse.redirect(new URL("/auth/start", req.url)); // Przekierowanie na stronę logowania
      }
    }

    return NextResponse.next();
}



export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
      // Dopasowanie do /nauczyciel i wszystkiego, co zaczyna się od tego path
      '/nauczyciel(.*)',
    ],
  }