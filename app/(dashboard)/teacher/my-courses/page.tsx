"use client";
import { ImageIcon, SquarePen, SquarePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useCurrentUser, useIsTeacher } from '@/hooks/user';
import { getMyCourses } from '@/actions/course/course';
import { useEffect, useState } from 'react';
import { Course } from '@prisma/client';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from "next/image";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

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
            <div className='space-y-[1vh]'>
            {courses.length>0 ? (
                courses.map((course) => (
                    <Card>
                        <div className='grid grid-cols-3'>
                            <div className='relative aspect-video object-cover rounded-l-lg'>
                                {course.imageUrl ? (
                                    <div className='relative aspect-video'>
                                        <Image
                                            fill
                                            className='object-cover rounded-lg'
                                            alt={course.title}
                                            src={course.imageUrl}
                                        />
                                    </div>
                                ):(
                                    <div className='h-full flex items-center justify-center bg-primary/10 rounded-l-lg'>
                                        <ImageIcon className='h-[5vh] w-[5vh]'/>
                                    </div>
                                )}
                            </div>
                            <div className='col-span-2'>
                                <CardHeader>
                                    <CardTitle>
                                        {course.title}
                                    </CardTitle>
                                </CardHeader>

                                <Separator/>
                                
                                <CardFooter className='py-[1vh]'>
                                <Link href={`/teacher/my-courses/${course.id}`}>
                                    <Button className='gap-x-[1vw]'>
                                        <SquarePen/> Edytuj
                                    </Button>
                                </Link>
                                </CardFooter>
                            </div>
                        </div>
                    </Card>
                ))
            ):(
                <div>
                    Brak kursów
                </div>
            )}
            </div>
            <Button className='flex gap-x-[1vw]' onClick={() => router.push("/teacher/my-courses/create")}>
                <SquarePlus/>
                Stwórz nowy kurs
            </Button>
        </div>

    );
}
 
export default MyCourses;
