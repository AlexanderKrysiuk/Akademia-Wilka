"use client"
import UserButton from '@/components/navbar/user-button';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link} from "@heroui/react";
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Importujemy hook do pobierania aktualnej ścieżki
import { useCurrentUser } from '@/hooks/user';
import { Settings } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname();
    const user = useCurrentUser()

    const menuItems = [
        "kursy"
    ]

    return (
        <Navbar
            isBordered
            onMenuOpenChange={setIsMenuOpen}
            //height={68}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="lg:hidden">
                </NavbarMenuToggle>
                <NavbarBrand>
                    <Image
                        //as={Link}
                        //href={"/"}
                        height={100}
                        src='/logo-banner-light.svg'
                        alt='Akademia Wilka'
                    />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent
                className='hidden lg:flex gap-4'
                justify='end'
            >
                {menuItems.map((item,index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link href={`/${item}`}>{item}</Link>
                    </NavbarMenuItem>
                ))}
            </NavbarContent>
            <ThemeSwitcher/>
            <UserButton/>
            <NavbarMenu>
                {menuItems.map((item,index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link href={`/${item}`}>{item}</Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen} 
            className='shadow-md dark:shadow-white'
        >
            <NavbarBrand>
                <Image
                    src="/logo.png"
                    alt="logo"
                    className=''
                />
            </NavbarBrand>

            <NavbarContent
                className='border-1 border-pink-500'
            >
            </NavbarContent>     
                <NavbarMenu>
                    {menuItems.map((item,index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link href={`/${item}`}>{item}</Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
                        {/*
                        <Image
                            //className='flex border-1 border-green' 
                            //src="/logo.png" 
                            //alt="Logo" 
                        />
                    */}
                <NavbarBrand 
                    className='border-1 border-red-500 h-full'
                >
                   
                </NavbarBrand>
            <div className='hidden md:flex'>
                {menuItems.map((item,index) => (
                    <NavbarItem key={`${item}-${index}`}>
                        <Link className={`hover:transition-all duration-500 hover:underline hover:text-primary ${pathname.startsWith(`/${item}`) ? 'text-primary' : ''}`} href={`/${item}`}>{item}</Link>
                    </NavbarItem>
                ))}
            </div>
            <ThemeSwitcher/>
            <UserButton/>    
        </Navbar>
    )
}
