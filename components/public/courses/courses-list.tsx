"use client"

import { getAllPublishedCourses } from "@/actions/course/course"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { slugify } from "@/utils/link"
import { Category, Course, Level } from "@prisma/client"
import { BookOpenText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import CourseCard from "./course-card"
import { useCurrentUser } from "@/hooks/user"

interface ExtendedCourse extends Course {
    category: Category | null
    level: Level | null
    chapterCount: number
    lessonCount: number
    purchased: boolean
}


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
            {/* {JSON.stringify(courses, null, 2)} */}
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