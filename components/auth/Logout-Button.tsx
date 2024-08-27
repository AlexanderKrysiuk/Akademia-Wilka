// components/auth/LogOutButton.tsx

"use client";

import { signOut } from "next-auth/react";

interface LogOutButtonProps {
    children?: React.ReactNode;
    redirectUrl?: string; // Opcjonalny URL do przekierowania
}

export const LogOutButton = ({ 
    children,
    redirectUrl = "/" // Domyślny URL przekierowania
}: LogOutButtonProps) => {
    const handleClick = async () => {
        await signOut({ callbackUrl: redirectUrl }); // Wywołanie `signOut` z `callbackUrl`
    };

    return (
        <span onClick={handleClick} className="cursor-pointer">
            {children}
        </span>
    );
};
