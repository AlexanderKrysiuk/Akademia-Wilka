{/*
"use client"

import { getCourseBySlug } from "@/actions/course/course"
import { Separator } from "@/components/ui/separator"
import { Course } from "@prisma/client"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import ChapterList from "./chapter-list"

export default function LessonLayout({
    children,
    params
}:{
    children: React.ReactNode,
    params: {CourseSlug:string}
}){
    //const params = useParams()
    //const { CourseSlug, ChapterSlug, LessonSlug } = params
    const [course, setCourse] = useState<Course>()

    const fetchCourse = async () => {
        const course = await getCourseBySlug(params.CourseSlug)
        if(!course || !course.slug){
            return
        }
        setCourse(course)
    }

    useEffect(()=>{
        fetchCourse();
    },[])

    if (!course) {
        return
    }

    return (
        <div className="flex flex-grow overflow-hidden">
                <div className="w-1/5 border-r overflow-y-auto min-h-[90vh]">
                    <h6 className="px-[1vw]">Zawartość Kursu</h6>
                    <ChapterList
                        course={course}
                    />
                </div>

                <div className="flex-grow p-4 overflow-y-auto">
                    {children}
                </div>
            </div>
    )
}
*/}