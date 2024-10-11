"use client";
import { ImageIcon } from 'lucide-react';
import { useCurrentUser,  } from '@/hooks/user';
import { useEffect, useState } from 'react';
import { Course } from '@prisma/client';
import Image from "next/image";
import Link from 'next/link';
import { GetMyCreatedCourses } from '@/actions/course-teacher/course';
import Loader from '@/components/loader';
import { Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import CreateCourseModal from '@/components/Course-Create/Course/CreateCourseModal';

const MyCourses = () => {    
    const user = useCurrentUser()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchMyCreatedCourses() {
        try {
            if (!user) return
            const fetchedCourses = await GetMyCreatedCourses(user.id)
            setCourses(fetchedCourses)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchMyCreatedCourses()
    },[user])

    if (loading) {
        return <Loader/>
    }

    return ( 
        <main className='space-y-[4vh]'>
            <CreateCourseModal/>
            
            {courses.length>0 && (
                courses.map((course) => (
                    <Card className='w-full'>
                        <div className='lg:flex'>
                            <div className='lg:w-1/4'>
                                {course.imageUrl ? (
                                    <Image
                                        fill
                                        className='object-cover lg:rounded-l-lg aspect-video'
                                        alt={course.title}
                                        src={course.imageUrl}
                                    />
                                ) : (
                                    <div className='h-full w-full aspect-video flex items-center justify-center bg-primary/10 rounded-t-lg lg:rounded-t-none lg:rounded-l-lg'>
                                        <ImageIcon className='h-10 v-10'/>
                                    </div>
                                )}
                            </div>
                            <div className='lg:w-3/4'>
                                <CardHeader>
                                    <h4>{course.title}</h4>
                                </CardHeader>
                                <CardBody>
                                </CardBody>
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
