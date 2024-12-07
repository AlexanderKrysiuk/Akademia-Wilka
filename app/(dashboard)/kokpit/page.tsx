"use client";

import { useCurrentUser } from "@/hooks/user";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

import {  Listbox,  ListboxSection,  ListboxItem} from "@nextui-org/listbox";

const DashboardPage = () => {
    //const isTeacher = useIsTeacher()
    const { data: session, status } = useSession();
    const user = useCurrentUser()
    
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
        <h1>Welcome </h1>
        {/* 
        <button onClick={handleSignOut}>Sign out</button>
        Session
        <pre>{JSON.stringify(session, null, 2)}</pre>
        USER
        <pre>{JSON.stringify(user,null,2)}</pre>
    */}
        </div>
    );
};

export default DashboardPage;
