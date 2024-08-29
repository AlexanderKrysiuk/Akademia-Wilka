"use client";
import { SquarePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useCurrentUser, useIsTeacher } from '@/hooks/user';
import { getMyCourses } from '@/actions/course/course';
import { useEffect, useState } from 'react';
import { Course } from '@prisma/client';

const MyCourses = () => {
    const user = useCurrentUser()
    const isTeacher = useIsTeacher()
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([])
    console.log(user.id)

    const fetchMyCourses = async () => {
        const courses = await getMyCourses(user.id)
        setCourses(courses)
    }

    useEffect(()=>{
        fetchMyCourses();
    },[])

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
            {courses.length>0 ? (
                courses.map((course) => (
                    <div key={course.id}>
                        {course.id}
                        {course.title}
                    </div>
                ))
            ):(
                <div>
                    Brak kursów
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
