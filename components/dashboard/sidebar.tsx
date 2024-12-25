"use client"

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";

import { teacherItems, userItems } from "@/components/dashboard/menu";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/user";
import { UserRole } from "@prisma/client";

const SideBar = () => {

    const user = useCurrentUser();
    const pathname = usePathname()

    return ( 
        <Listbox
            className="border-r w-full"
        >
            <ListboxSection showDivider title="Ogólne" items={userItems}>
                {(item)=>(
                    <ListboxItem
                        key={item.key}
                        href={item.href}
                        startContent={<item.icon/>}
                        className={pathname.startsWith(item.href) ? "bg-muted text-primary rounded-none" : ""} // Dodanie klasy jeśli ścieżka się zgadza
                    >
                        {item.label}
                    </ListboxItem>
                )}
            </ListboxSection>
            <ListboxSection
                showDivider
                title="Nauczyciel"
                items={teacherItems}
                hidden={!user || !user.role.includes(UserRole.Teacher)}
            >
                {(item)=>(
                    <ListboxItem
                        key={item.key}
                        href={item.href}
                        startContent={<item.icon/>}
                        className={pathname.startsWith(item.href) ? "bg-muted text-primary rounded-none" : ""} // Dodanie klasy jeśli ścieżka się zgadza
                    >
                        {item.label}
                    </ListboxItem>
                )}
            </ListboxSection>
        </Listbox>
     );
}
 
export default SideBar;