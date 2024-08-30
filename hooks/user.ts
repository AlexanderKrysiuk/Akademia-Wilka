import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const {data} = useSession();

    return data?.user;
}

export const useIsTeacher = () => {
    const user = useCurrentUser()
    return user?.roles.includes(UserRole.Teacher ?? false)    
}