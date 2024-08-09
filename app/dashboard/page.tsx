"use client"
import { useCurrentUser } from "@/hooks/user";

const DashboardPage = () => {
    const user = useCurrentUser()
    return ( 
        <div>
            {JSON.stringify(user)}
        </div>
     );
}
 
export default DashboardPage;