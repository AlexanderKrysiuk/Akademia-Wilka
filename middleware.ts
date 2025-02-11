import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Zakładam, że masz tutaj auth()

export async function middleware(req: NextRequest) {
    const session = await auth();

    // Jeśli użytkownik jest zalogowany i próbuje wejść na stronę logowania
    if (session && req.url.includes("/auth/start")) {
        // Przekierowanie na stronę główną lub inną
        return NextResponse.redirect(new URL("/", req.url)); // Przekierowanie na stronę główną
    }

    return NextResponse.next();
}



export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }