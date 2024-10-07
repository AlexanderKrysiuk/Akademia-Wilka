"use client"

import { useCurrentUser } from "@/hooks/user";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { UserRole } from "@prisma/client";
import { Layout, Rocket } from "lucide-react";

const DashboardMenu = () => {
    
    const user = useCurrentUser()
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
//            className="border-violet-500 border-4 px-0 mx-0"
            className="px-0 mx-0"
            itemClasses={{
                //base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                
                wrapper: "w-full flex px-0 mx-0",
                title: "text-2xl",
                base: "w-full flex justify-center rounded-none border-red-500 border-4",
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
                    >
                        {item.label}
                    </ListboxItem>
                )}
            </ListboxSection>

        </Listbox>
    );
}
 
export default DashboardMenu;