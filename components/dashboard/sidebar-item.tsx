"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon
    label: string
    href: string
}

const SidebarItem = ({
    icon: Icon,
    label,
    href 
}: SidebarItemProps ) => {
    const pathname = usePathname()
    const router = useRouter()

    const isActive = (pathname === "/" && href === "/") || pathname === href || pathname?.startsWith(`${href}/`)
    //const isActive = pathname === href || pathname.startsWith(`${href}/`);


    const onClick = () => {
        router.push(href);
    }
    
    return (
        <button
            onClick={onClick}
            type="button"
            className={cn("md:w-[20vw] items-center gap-x-[1vw] text-sm font-[500] px-[2vw] transition-all duration-500 hover:bg-foreground/20",isActive && "text-primary bg-foreground/20 hover:bg-foreground/20 border-r-4 border-primary")}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(isActive &&  "text-primary")}
                />
                {label}
            </div>
            <div
                className={cn("ml-auto opacity-0 h-full transition-all", isActive && "opacity-100")}
        />
        </button>
    );
}
 
export default SidebarItem;