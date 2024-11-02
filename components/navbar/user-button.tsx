"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/user';
import { LogOutButton } from '@/components/auth/Logout-Button';
import { RxExit } from "react-icons/rx";
import { TfiDashboard } from "react-icons/tfi";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import { userItems, teacherItems } from '../dashboard/menu';
import { usePathname } from 'next/navigation';
import { UserRole } from '.prisma/client';
import { LogOut } from 'lucide-react';

const UserButton = () => {
    
    const user = useCurrentUser(); // Użyj hooka do pobrania użytkownika
    const pathname = usePathname()

    if (user) {
        return (
            <Dropdown className='rounded-none'>
                <DropdownTrigger>
                    <Avatar                        
                        showFallback
                        src={user.image ? user.image : undefined}
                        className='transition-all hover:cursor-pointer hover:ring-2 hover:ring-primary duration-500'
                    />
                </DropdownTrigger>
                <DropdownMenu variant="light">
                    <DropdownSection title="Ogólne" items={userItems} showDivider>
                        {(item)=>(
                            <DropdownItem
                                key={item.key}
                                href={item.href}
                                startContent={<item.icon size={16}/>}
                                className={pathname.startsWith(item.href) ? "bg-muted text-primary rounded-none" : ""} // Dodanie klasy jeśli ścieżka się zgadza
                            >
                                {item.label}
                            </DropdownItem>
                            )}
                    </DropdownSection>
                    <DropdownSection title="Nauczyciel" items={user.role.includes(UserRole.Teacher) ? teacherItems : []} showDivider>
                        {(item)=>(
                            <DropdownItem
                                key={item.key}
                                href={item.href}
                                startContent={<item.icon size={16}/>}
                                className={pathname.startsWith(item.href) ? "bg-muted text-primary rounded-none" : ""} // Dodanie klasy jeśli ścieżka się zgadza
                            >
                                {item.label}
                            </DropdownItem>
                        )}
                    </DropdownSection>  
                        <DropdownItem
                            startContent={<LogOut size={16}/>}
                            >
                            <LogOutButton>
                            Wyloguj
                    </LogOutButton>
                        </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

    return (
        <Button variant="outline" className='max-h-[8vh] items-center flex'>
            <Link href="/auth/start" passHref>
                Zacznij Tutaj
            </Link>
        </Button>
    );
};

export default UserButton;
