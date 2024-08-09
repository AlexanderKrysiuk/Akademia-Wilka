import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

export const useCurrentUser = () => {
    const session = useSession();

    return session.data?.user;
}

export function checkIfTeacherRedirect() {
    const user = useCurrentUser();
    if (!user?.role?.teacher) {
        redirect("/");
    }
}