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
                        className='hidden lg:block'
                    />
                    <Image
                        height={64}
                        src='/logo-square-light.svg'
                        alt='Akademia Wilka'
                        className='lg:hidden'
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
}
