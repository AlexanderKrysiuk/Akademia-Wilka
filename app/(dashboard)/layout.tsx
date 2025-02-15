"use client"

import { TeacherItems } from "@/components/user-menu/user-menu";
import { useCurrentUser } from "@/hooks/user";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { Role } from "@prisma/client";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ 
    children 
} : { 
    children: React.ReactNode 
}) => {
    const user = useCurrentUser()
    const pathname = usePathname()
    return ( 
        <main className="h-full lg:grid lg:grid-cols-5">
            <div className="hidden lg:block lg:col-span-1 border-r">
                <Listbox
                    className="pr-0"
                    aria-label="Dashboard Menu"
                >
                {user && user.role === Role.Admin ? (
                    <ListboxSection
                        showDivider
                        title="Nauczyciel"
                        items={TeacherItems}
                    >
                        {(item) => (
                            <ListboxItem
                                key={item.title}
                                href={item.href}
                                color={pathname.startsWith(item.href) ? "primary" : "default"}
                                startContent={item.icon}
                                className={`rounded-none ${pathname.startsWith(item.href) && "text-primary border-r-4 border-primary hover:text-white"} transition-colors duration-400`}
                                title={item.title}
                            />
                        )}
                    </ListboxSection>
                    ) : null}
                </Listbox>            
            </div>
            <div className="lg:col-span-4">
                {children}
            </div>
        </main>
     );
}
 
export default DashboardLayout;