"use client"
import UserButton from '@/components/navbar/user-button';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Badge, Avatar, Divider, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection} from "@heroui/react";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Importujemy hook do pobierania aktualnej ścieżki
import { useCurrentUser } from '@/hooks/user';
import { GraduationCap, LogIn, LogOut, ShoppingCart } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import { basicLinks, teacherLinks } from '../menu';
import { CartButton } from '../cart/cart';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname();
    const user = useCurrentUser()
    const router = useRouter()

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
                <div
                    className='hidden lg:block'
                >
                    {basicLinks.map((item, key)=>(
                        <NavbarItem
                            key={key}
                        >
                            <Link
                                color='foreground'
                                href={item.href}
                            >
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </div>
                <ShoppingCart
                    className='hidden'
                />
                <CartButton/>
                <ThemeSwitcher/>
                <div
                    className='hidden lg:block'
                >

                    {user ? (
                        <Dropdown
                            placement='bottom-end'
                            radius='none'
                        >
                            <DropdownTrigger>
                                <Avatar
                                    showFallback
                                    src={user.image!}
                                    as="button"
                                    className='transition-all hover:cursor-pointer hover:ring-2 hover:ring-primary duration-500'
                                />
                            </DropdownTrigger>
                            <DropdownMenu variant='light'>
                                <DropdownSection 
                                    title="Nauczyciel"
                                    hidden={!user.role.includes(UserRole.Teacher || UserRole.Admin)}
                                    items={teacherLinks}
                                    showDivider
                                >
                                    {(item)=>(
                                        <DropdownItem
                                            key={item.label}
                                            href={item.href}
                                            startContent={<item.icon size={16}/>}
                                        >
                                            {item.label}
                                        </DropdownItem>
                                    )}
                                </DropdownSection>
                                <DropdownItem
                                    key={''}
                                    startContent={<LogOut size={16}/>}
                                    onPress={()=>{
                                        signOut()
                                        router.refresh()
                                    }}
                                >
                                    Wyloguj
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        
                    ):(
                        <Button
                            size="sm"
                            variant="bordered"
                            as={Link}
                            href="/auth/start"
                        >
                            Zacznij tutaj
                        </Button>
                    )}
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
                {basicLinks.map((item, key)=>(
                        <NavbarMenuItem
                            key={key}
                        >
                            <Link
                                color='foreground'
                                href={item.href}
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
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
                                {teacherLinks.map((item, key)=>(
                                    <NavbarMenuItem
                                        key={key}
                                    >
                                        <Link
                                            color='foreground'
                                            href={item.href}
                                            className='flex gap-x-2'
                                        >
                                            <item.icon size={16}/>
                                            {item.label}
                                        </Link>
                                    </NavbarMenuItem>
                                ))}
                            </>
                        )}
                        <Divider/>
                        <NavbarMenuItem
                            onClick={()=>{
                                signOut()
                                router.refresh()
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
                    <>
                        <Divider/>
                        <NavbarMenuItem>
                            <Link
                                color='foreground'
                                href='/auth/start'
                                className='flex gap-x-2'
                            >
                                <LogIn size={16}/>
                                Logowanie            
                            </Link>
                        </NavbarMenuItem>
                    </>
                )}  
            </NavbarMenu>
        </Navbar>
    )
}
