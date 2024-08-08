"use client"

import { Compass, Layout } from 'lucide-react'
import SidebarItem from '@/components/dashboard/sidebar-item';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/user';

const geustRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard"
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/dashboard/search"
    }
]

const SidebarRoutes = () => {
    const routes = geustRoutes;
    const user = useCurrentUser()
    console.log(user)
    return ( 
        <div>
            <div className='w-full min-h-[15vh] max-h-[20vh] py-[1vh] px-[1vw] flex items-center space-x-[1vw] md:hidden'>
                <div className='h-[8vh] w-[8vh] relative'>
                <Image
                    src="/logo.png"
                    layout="fill"
                    objectFit="cover"
                    alt="Opis obrazka"
                    />
                </div>
                <h1>
                    Akademia Wilka
                </h1>
            </div>
            <div className="flex flex-col w-full">
                {routes.map((route) => (
                    <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                    />
                ))}
            </div>
        </div>
     );
}
 
export default SidebarRoutes;