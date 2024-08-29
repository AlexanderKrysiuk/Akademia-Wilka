"use client"

import { getAllPublishedCourses } from "@/actions/course/course"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Course } from "@prisma/client"
import { BookOpenText } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export const CoursesList = () => {
    const [courses, setCourses] = useState<Course[]>([])

    const fetchCourses = async () => {
        const courses = await getAllPublishedCourses();
        setCourses(courses)
    }

    useEffect(()=>{
        fetchCourses();
    },[])
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-[1vw]">
            {JSON.stringify(courses, null, 2)}
            {courses.length>0 ? (
                courses.map((course) => (
                    <Card>
                        <CardHeader>
                            <div className="relative w-full aspect-video">
                                <Image
                                    fill
                                    className="object-cover rounded-lg"
                                    alt={course.title}
                                    src={course.imageUrl!}
                                />
                            </div>
                            <CardTitle>{course.title}</CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                        </CardContent>
                        <CardDescription>
                            <BookOpenText/>
                            <span>
                                {}
                            </span>
                        </CardDescription>
                        <CardFooter>
                        <BookOpenText/>

                        </CardFooter>
                    </Card>
                ))
            ):(
                <div>
                    Brak kursów do wyświetlenia
                </div>
            )}
        </div>
    )
}