import { useCurrentUser } from "@/hooks/user";
import { FaUserCircle } from "react-icons/fa";
import Image from 'next/image';

const Avatar = () => {
    const user = useCurrentUser(); // Użyj hooka do pobrania użytkownika

    if (user) {
        return (
            <div className="flex items-center w-[8vh] h-[8vh] rounded-full">
                <div className="w-[6vh] h-[6vh] hover:ring-[1vh] transition-all duration-500 rounded-full flex items-center justify-center mx-auto">
                {user.image ? (
                    <Image
                    src={user.image}
                    layout="fill"
                    objectFit="cover"
                    alt="Opis obrazka"
                    />
                ) : (
                    <FaUserCircle className='w-full h-full' />
                )}
                </div>
            </div>
        );
    }
}
 
export default Avatar;