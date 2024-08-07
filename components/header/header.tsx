import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Header = () => {
    return ( 
        <div className="h-[10vh] w-full border-4 border-red-500 items-center flex px-[1vw] py-[1vh] justify-between">
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
            <div>
                <Button className='max-h-[8vh]'>
                    Zacznij Tutaj
                </Button>
            </div>
      </div>
    );
}
 
export default Header;