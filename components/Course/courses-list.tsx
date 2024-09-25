"use client"

import { getAllPublishedCoursesIDs } from "@/actions/course/course"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { slugify } from "@/utils/link"
import { Category, Course, Level } from "@prisma/client"
import { BookOpenText, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/user"
import { CourseCard } from "./course-card"

interface ExtendedCourse extends Course {
    category: Category | null
    level: Level | null
    chapterCount: number
    lessonCount: number
    purchased: boolean
}

interface CourseID {
    id: string
}

export const CoursesList = () => {
    const [coursesIDs, setCoursesIDs] = useState<CourseID[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCourses = async () => {
        const fetchedCoursesIDs = await getAllPublishedCoursesIDs();
        setCoursesIDs(fetchedCoursesIDs)
    }
    
    useEffect(()=>{
        setLoading(true)
        fetchCourses();
        setLoading(false)
    },[])
    
    return (
        <div className="w-full flex">
            {loading ? (
                <div className="w-full flex justify-center">
                    <Loader2 className="animate-spin mr-[1vw]"/>
                    Ładowanie...
                </div>
            ):(
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 justify-start gap-x-[1vw]">
                    {coursesIDs.length > 0 ? (
                        coursesIDs.map((courseID)=>(
                            <CourseCard
                                courseID={courseID.id}
                            />
                        ))
                    ):(
                        <div className="flex justify-center">
                            Brak kursów do wyświetlenia
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

{/*}
export const CoursesList = () => {
    const [courses, setCourses] = useState<ExtendedCourse[]>([])
    const user = useCurrentUser()

    const fetchCourses = async () => {
        const courses = await getAllPublishedCourses(user?.id);
        setCourses(courses)
    }

    useEffect(()=>{
        fetchCourses();
    },[])
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-[1vw]">
            {/* {JSON.stringify(courses, null, 2)} 
            {courses.length>0 ? (
                courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        category={course.category!}
                        level={course.level!}
                        chapterCount={course.chapterCount}
                        lessonCount={course.lessonCount}
                        purchased={course.purchased}
                    />
                ))
            ):(
                <div>
                    Brak kursów do wyświetlenia
                </div>
            )}
        </div>
    )
}
*/}