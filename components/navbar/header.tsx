"use client"
import Link from 'next/link';
import UserButton from '@/components/navbar/user-button';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import Image from 'next/image'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Importujemy hook do pobierania aktualnej ścieżki

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname();

    const menuItems = [
        "kursy"
    ]

    return (
        <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen} className='flex items-center shadow-md' >
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden">
                </NavbarMenuToggle>
                <NavbarMenu>
                    {menuItems.map((item,index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link href={`/${item}`}>{item}</Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
                <NavbarBrand className='h-full'>
                    <Link href="/" className='h-full flex items-center gap-x-[1vw]'>                
                        <Image className='max-h-full w-auto' src="/logo.png" alt="Logo" width={500} height={500}/>
                        <div className='hidden md:flex'>
                            Akademia Wilka
                        </div>
                    </Link>
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

{/* 
const Header = () => {
    return ( 
        <div className="h-[10vh] w-full items-center flex px-[1vw] py-[1vh] justify-between border-b shadow-sm">
            <div className='md:hidden'>
            <Sheet>
            <SheetTrigger>
            <Menu/>
            </SheetTrigger>
            <SheetContent side={`left`} className='p-0'>
            <SideBar/>
                    </SheetContent>
                    </Sheet>
                    </div>
                    <Link href="/" passHref className='flex items-center space-x-[1vh]'>    
                    <div className="relative flex w-[8vh] h-[8vh]">
                    <Image
                    src="/logo.png"
                    layout="fill"
                    objectFit="cover"
                    alt="Logo"
                    />
                    </div>
                    <h1>
                    Akademia Wilka
                </h1>
            </Link>
            <div className='max-h-[8vh] flex items-center space-x-[1vw]'>
            <MenuLinks/>
            <ThemeSwitcher/>
            <UserButton/>
            </div>
            </div>
        );
}
 
export default Header;
    */}