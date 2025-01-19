"use client"
import UserButton from '@/components/navbar/user-button';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Badge, Avatar, Divider} from "@heroui/react";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Importujemy hook do pobierania aktualnej ścieżki
import { useCurrentUser } from '@/hooks/user';
import { GraduationCap, LogIn, LogOut, ShoppingCart } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname();
    const user = useCurrentUser()
    const router = useRouter()

    const menuItems = [
        "kursy"
    ]

    return (
        <Navbar
            isBordered
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent
                justify='start'
            >
                <NavbarBrand>
                    <Link
                        href='/'
                    >
                        <Image
                            //as={Link}
                            //href={"/"}
                            height={100}
                            src='/logo-banner-light.svg'
                            alt='Akademia Wilka'
                        />
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent
                justify='end'
            >
                <NavbarItem>
                    <Link
                        color='foreground'
                        href='/kursy'
                    >
                        Kursy
                    </Link>
                </NavbarItem>
                <ShoppingCart
                    className='hidden'
                />
                <ThemeSwitcher/>
                <div
                    className='hidden lg:block'
                >
                    <UserButton/>
                </div>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="lg:hidden"    
                />
            </NavbarContent>
            <NavbarMenu>
                {user &&
                    <div className='flex flex-col gap-2'>
                        <div
                            className='flex items-center justify-end w-full gap-2'
                        >
                            Witaj {user.name}
                            <Avatar
                                showFallback
                                src={user.image!}
                            />
                        </div>
                        <Divider/>
                    </div>
                }
                <NavbarMenuItem>
                    <Link
                        href='/kursy'
                        color='foreground'
                    >
                        Wszystkie Kursy
                    </Link>
                </NavbarMenuItem>
                {user ? (
                    <>
                        {user.role.includes(UserRole.Teacher || UserRole.Admin) &&(
                            <>
                                <div
                                    className='text-primary flex gap-x-2'
                                >
                                    <GraduationCap/>
                                    Nauczyciel
                                </div>
                                <Divider/>
                                <NavbarMenuItem>
                                    <Link
                                        color='foreground'
                                        href='/teacher/my-courses'
                                    >
                                        Moje utworzone kursy
                                    </Link>
                                </NavbarMenuItem>

                            </>
                        )}
                        <NavbarMenuItem
                            onClick={()=>{
                                signOut()
                                router.push("/")
                            }}
                        >
                            <Link
                                color='foreground'
                                className='cursor-pointer gap-2'
                            >
                                <LogOut size={16}/>
                                Wyloguj
                            </Link>
                        </NavbarMenuItem>
                    </>
                ) : (
                    <NavbarMenuItem>
                        <Link
                            href='/auth/start'
                            color='foreground'
                            className='gap-2'
                        >
                            Logowanie
                            <LogIn size={16}/>
                        </Link>
                    </NavbarMenuItem>
                )}  
            </NavbarMenu>
        </Navbar>
    )
}
