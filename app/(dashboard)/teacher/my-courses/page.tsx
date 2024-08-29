"use client";
import { SquarePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useIsTeacher } from '@/hooks/user';

const MyCourses = () => {
    const isTeacher = useIsTeacher()
    const router = useRouter();
    return ( 
        <div className='px-[1vw] py-[1vh]'>
            {isTeacher ? (
                <div>
                    Tak jestem nauczycielem
                </div>
            ):(
                <div>

                Nie jestem nauczycielem
                </div>
            )}
            <Button className='flex gap-x-[1vw]' onClick={() => router.push("/teacher/my-courses/create")}>
                <SquarePlus/>
                Stwórz nowy kurs
            </Button>
        </div>

    );
}
 
export default MyCourses;
