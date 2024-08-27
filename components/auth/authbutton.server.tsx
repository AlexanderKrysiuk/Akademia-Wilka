import { SessionProvider } from "next-auth/react";
import { BASE_PATH, auth } from "@/auth"
import AuthButtonClient from "./authbutton.client";

export default async function AuthButtonServer() {
    const session = await auth();
    if (session && session.user) {
        session.user = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email
        }
    }
    return (
        <SessionProvider basePath={BASE_PATH} session={session}>
            <AuthButtonClient/>
        </SessionProvider>
    )
}
