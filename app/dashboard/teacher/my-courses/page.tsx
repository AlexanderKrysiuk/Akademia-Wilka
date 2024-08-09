"use client";
import { SquarePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { checkIfTeacherRedirect } from "@/hooks/user";
import { useRouter } from 'next/navigation';

const MyCourses = () => {
    const router = useRouter();
    checkIfTeacherRedirect();

    return ( 
        <div className='px-[1vw] py-[1vh]'>
            <Button className='flex gap-x-[1vw]' onClick={() => router.push("/dashboard/teacher/my-courses/create")}>
                <SquarePlus/>
                Stwórz nowy kurs
            </Button>
        </div>
    );
}
 
export default MyCourses;
