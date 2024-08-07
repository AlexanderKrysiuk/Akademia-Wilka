import Image from 'next/image';
import Link from 'next/link';
import UserButton from '@/components/header/user-button';

const Header = () => {
    return ( 
        <div className="h-[10vh] w-full items-center flex px-[1vw] py-[1vh] justify-between">
            <Link href="/" passHref className='flex items-center space-x-[1vh]'>    
                <div className="relative flex w-[8vh] h-[8vh]">
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
            </Link>
            <div className='max-h-[8vh]'>
                <UserButton/>
            </div>
      </div>
    );
}
 
export default Header;