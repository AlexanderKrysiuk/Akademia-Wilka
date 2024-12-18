"use client";
import { ImageIcon } from 'lucide-react';
import { useCurrentUser,  } from '@/hooks/user';
import { useCallback, useEffect, useState } from 'react';
import { Course, UserRole } from '@prisma/client';
import Image from "next/image";
import Link from 'next/link';
import { GetMyCreatedCourses } from '@/actions/course-teacher/course';
import PageLoader from '@/components/page-loader';
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import CreateCourseModal from '@/components/Course-Create/Course/create-course-modal';

const MyCourses = () => {    
    const user = useCurrentUser()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMyCreatedCourses = useCallback(async () => {
        try {
            if (!user || !user.role.includes(UserRole.Teacher || UserRole.Admin)) return;
            const fetchedCourses = await GetMyCreatedCourses(user.id);
            setCourses(fetchedCourses);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [user]);
    

    useEffect(()=>{
        fetchMyCreatedCourses()
    },[user, fetchMyCreatedCourses])

    if (loading) {
        return <PageLoader/>
    }

    return ( 
        <main className='space-y-[4vh]'>
            <CreateCourseModal/>
            
            {courses.length > 0 && (
    courses.map((course) => (
        <Card key={course.id} className='w-full'>
            <div className='flex'>
                <div className='w-1/3 h-auto'>
                    {course.imageUrl ? (
                        <Image
                            width={1600}
                            height={900}
                            className='aspect-video'
                            alt={course.title}
                            src={course.imageUrl}
                        />
                    ) : (
                        <div className='aspect-video flex items-center justify-center bg-primary/10 rounded-t-lg lg:rounded-t-none lg:rounded-l-lg'>
                            <ImageIcon className='h-10 w-10'/>
                        </div>
                    )}
                </div>
                <div className='w-2/3'>
                    <CardHeader>
                        <h4>{course.title}</h4>
                    </CardHeader>
                    <CardFooter>
                        <Link href={`/teacher/my-courses/${course.id}`}>
                            <Button color="primary">
                                Edytuj
                            </Button>
                        </Link>
                    </CardFooter>
                </div>
            </div>
        </Card>
    ))
)}

            
            
            {/*{JSON.stringify(user,null,2)}
            {JSON.stringify(courses,null,2)}*/}
        {/* 
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
        */}
        </main>

    );
}
 
export default MyCourses;
