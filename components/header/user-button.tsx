"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/user';
import Avatar from './avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { LogOutButton } from '@/components/auth/Logout-Button';
import { RxExit } from "react-icons/rx";

const UserButton = () => {
    const user = useCurrentUser(); // Użyj hooka do pobrania użytkownika

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <LogOutButton>
                        <DropdownMenuItem>
                            <RxExit className="h-4 w-4 mr-2 flex"/>
                            Wyloguj
                        </DropdownMenuItem>
                    </LogOutButton>                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button variant="outline" className='max-h-[8vh] items-center flex'>
            <Link href="/auth/login" passHref>
                Zacznij Tutaj
            </Link>
        </Button>
    );
};

export default UserButton;
