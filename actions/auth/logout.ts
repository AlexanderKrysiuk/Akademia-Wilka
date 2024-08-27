"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const logout = async () => {
    // Wykonaj wylogowanie
    await signOut({ redirect: false }); // Zapobiega automatycznemu przekierowaniu
    // Ręczne przekierowanie po wylogowaniu
    const router = useRouter();
    router.push("/"); // Przekierowanie na stronę główną lub logowania
};
