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
import { prisma } from "@/lib/prisma"

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
        <main className='space-y-4 grid grid-d w-full'>
            <CreateCourseModal/>
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
                    {courses.map((course)=>(
                        <Card key={course.id}>
                            {course.imageUrl ? (
                                <Image
                                    width={1600}
                                    height={900}
                                    className='aspect-video'
                                    alt={course.title}
                                    src={course.imageUrl}
                                />
                            ) : (
                                <div className='aspect-video flex items-center justify-center bg-primary/10 rounded-b-none'>
                                    <ImageIcon className='h-10 w-10'/>
                                </div>
                            )}
                            <CardHeader>
                                {course.title}
                            </CardHeader>
                            <CardFooter>
                                <Link href={`/teacher/my-courses/${course.id}`}>
                                    <Button color="primary">
                                        Edytuj
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className='w-full justify-center flex'>
                    Brak kursów do wyświetlenia
                </div>
            )}
        </main>
    );
}
 
export default MyCourses;
