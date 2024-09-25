"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/user';
import Avatar from './avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { LogOutButton } from '@/components/auth/Logout-Button';
import { RxExit } from "react-icons/rx";
import { TfiDashboard } from "react-icons/tfi";


const UserButton = () => {
    
    const user = useCurrentUser(); // Użyj hooka do pobrania użytkownika

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href="/kokpit" passHref>
                            <TfiDashboard className='h-4 w-4 mr-2 flex'/>
                            Panel Sterowania    
                        </Link>    
                    </DropdownMenuItem>       
                    <LogOutButton>
                        <DropdownMenuItem>
                            <RxExit className="h-4 w-4 mr-2 flex"/>
                            Wyloguj
                        </DropdownMenuItem>
                    </LogOutButton>
                </DropdownMenuContent>
            </DropdownMenu>
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
