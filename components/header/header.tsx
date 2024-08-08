import Image from 'next/image';
import Link from 'next/link';
import UserButton from '@/components/header/user-button';
import { ModeButton } from '../ModeButton';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SideBar from '@/components/dashboard/sidebar';

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
                <ModeButton/>
                <UserButton/>
            </div>
      </div>
    );
}
 
export default Header;