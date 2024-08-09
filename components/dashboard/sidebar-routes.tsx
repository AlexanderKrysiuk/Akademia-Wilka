"use client"

import { Compass, Layout, Rocket } from 'lucide-react'
import SidebarItem from '@/components/dashboard/sidebar-item';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/user';
import { Separator } from '@/components/ui/separator';
import { FaChalkboardTeacher } from "react-icons/fa";


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

const teacherRoutes = [
    {
        icon: Rocket,
        label: "Moje kursy",
        href: "/dashboard/teacher/my-courses"
    },
    {
        icon: Compass,
        label: "Teacher Resources",
        href: "/dashboard/resources"
    }
];



const SidebarRoutes = () => {
    const user = useCurrentUser()

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
                {geustRoutes.map((route) => (
                    <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                    />
                ))}
            </div>
            {user?.role?.teacher && (
                <div className="flex flex-col w-full">
                    <Separator/>
                    <div className='flex py-[1vh] px-[2vw] gap-x-[1vw] items-center'>
                        <FaChalkboardTeacher size={22}/>
                        <h1>
                            Nauczyciel
                        </h1>
                    </div>

                    {teacherRoutes.map((route) => (
                        <SidebarItem
                            key={route.href}
                            icon={route.icon}
                            label={route.label}
                            href={route.href}
                        />
                ))}
                </div>
            )}
        </div>
     );
}
 
export default SidebarRoutes;