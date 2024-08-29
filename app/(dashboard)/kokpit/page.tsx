"use client";

import { useIsTeacher } from "@/hooks/user";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const DashboardPage = () => {
    const isTeacher = useIsTeacher()
    const { data: session, status } = useSession();
    
    useEffect(() => {
        if (status === "loading") {
            // Zwróć ładowanie, gdy status jest "loading"
            return;
        }
        
        {/* 
        if (!session) {
            // Przekierowanie, jeśli sesja jest pusta
            window.location.href = "/login"; // Lub użyj routera Next.js, jeśli wolisz
        }
    */}
    }, [session, status]);
    
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        window.location.href = "/login"; // Lub użyj routera Next.js
    };
    
    if (status === "loading") {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            {isTeacher ? (
                <div>
                    Tak jestem nauczycielem
                </div>
            ):(
                <div>

                Nie jestem nauczycielem
                </div>
            )}
        <h1>Welcome, {session?.user?.name}</h1>
        <button onClick={handleSignOut}>Sign out</button>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    );
};

export default DashboardPage;
