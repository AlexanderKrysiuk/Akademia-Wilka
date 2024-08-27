"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  return session ? (
    <Button onClick={() => signOut()}>
      {session.user?.name} : Wyloguj
    </Button>
  ) : (
    <Button onClick={() => signIn()}>Zacznij Tutaj</Button>
  );
}



{/* 
"use client";

import { useSession, signIn as naSignIn, signOut as naSignOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButtonClient() {
  const { data: session } = useSession();

  return session?.user ? (
      <Button
      onClick={async () => {
          await naSignOut();
          // Odśwież stronę po wylogowaniu
          window.location.reload();
        }}
        >
        {session.user.name} : Sign Out
        </Button>
    ) : (
        <Button
        onClick={async () => {
            await naSignIn();
            // Możesz dodać tutaj obsługę po zalogowaniu, jeśli potrzebne
        }}
        >
        Sign In
        </Button>
    );
}

*/}