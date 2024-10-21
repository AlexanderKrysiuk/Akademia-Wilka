"use client"

import { useCurrentUser } from "@/hooks/user";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { UserRole } from "@prisma/client";
import { Layout, Rocket } from "lucide-react";
import { usePathname } from "next/navigation";

const DashboardMenu = () => {
    
    const user = useCurrentUser()
    const pathname = usePathname()
    if (!user) {
        return null
    }

    
    const userItems = [
        {
            key: "kokpit",
            label: "Kokpit",
            href: "/kokpit",
            icon: Layout
        }
    ]

    const teacherItems = [
        {
            key: "my-courses",
            label: "Moje kursy",
            href: "/teacher/my-courses",
            icon: Rocket
        }
    ]

   

    return (         
        <Listbox
            aria-label="Dashboard Menu"
            className="px-0 py-0 shadow-sm"
            itemClasses={{
                base: "w-full flex justify-center rounded-none",
            }}            
            >
            <ListboxSection
                title={"Ogólne"}
                items={userItems}
            >
                {(item)=> (
                    <ListboxItem
                        key={item.key}
                        href={item.href}
                        startContent={<item.icon/>}
                        className={pathname === item.href ? "bg-muted border-r-4 border-primary text-primary" : ""} // Dodanie klasy jeśli ścieżka się zgadza
                    >
                        {item.label}
                    </ListboxItem>
                )}
            </ListboxSection>
            <ListboxSection
                title={"Nauczyciel"}
                items={user?.role?.includes(UserRole.Teacher) ? teacherItems : []}
                
            >
                {(item)=> (
                    <ListboxItem
                        key={item.key}
                        href={item.href}
                        startContent={<item.icon/>}
                        className={pathname === item.href ? "bg-muted border-r-4 border-primary text-primary" : ""} // Dodanie klasy jeśli ścieżka się zgadza
                    >
                        {item.label}
                    </ListboxItem>
                )}
            </ListboxSection>

        </Listbox>
    );
}
 
export default DashboardMenu;