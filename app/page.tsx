"use client"

import { useCurrentUser } from "@/hooks/user";

export default function Home() {
  const user = useCurrentUser()
  return (
    <main className="absolute inset-0 flex items-center justify-center">
      Aplikacja w budowie
      {JSON.stringify(user,null,2)}
    </main>
  );
}
