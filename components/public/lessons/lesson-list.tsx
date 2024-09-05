"use client"

import { getPublishedLessonsByChapterID, getPublishedLessonsByCourseID } from "@/actions/course/lesson"
import { Chapter, Course, Lesson, LessonType } from "@prisma/client"
import { Eye, Lock, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { MonitorPlay } from 'lucide-react';
import { ExtendedLesson } from "@/types/lesson"
import { formatTime } from "@/utils/time"
import { CardContent } from "@/components/ui/card"
import { getCourseBySlug } from "@/actions/course/course"
import { getCourseById } from "@/actions/course/get"
import Link from "next/link"

interface LessonListProps {
    course: {
        id:string
        slug:string
    }
    chapter: Chapter
}

const LessonList = ({
    course,
    chapter
}:LessonListProps) => {
    const [lessons, setLessons] = useState<ExtendedLesson[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchLessons = async () => {
        setLoading(true)
        const lessons = await getPublishedLessonsByChapterID(chapter.id)
        setLessons(lessons)
        setLoading(false)
    }

    useEffect(()=>{
        fetchLessons();
    },[])

    return (
        <div className="w-full">
            {loading ? (
                <div className="flex items-center justify-center w-full my-[2vh]">
                    <Loader2 className="animate-spin mr-2"/>
                    Ładowanie...
                </div>
            ):(
                lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        (lesson.type === LessonType.Video && (
                            <Link
                                key={lesson.id}
                                href={`/kurs/${course.slug}/${chapter.slug}/${lesson.slug}`}
                            >
                                <CardContent className="mx-0 flex items-center justify-between w-full py-[1vh] space-x-[1vw] hover:text-primary hover:bg-foreground/10 transition-all duration-300">
                                    <div>
                                        <MonitorPlay/>
                                    </div>
                                    <div className="w-full justify-start truncate">
                                        {lesson.title}
                                    </div>
                                    <div>
                                        {formatTime(lesson.video?.duration)}
                                    </div>
                                    <div>
                                        {lesson.free ? (
                                            <Eye/>
                                        ):(
                                            <Lock/>
                                        )}
                                    </div>
                            </CardContent>
                            </Link>
                        ))
                    ))
                ):(
                    <div className="flex itemst center justify-center w-full my-[2vh]">
                        Brak lekcji do wyświetlenia...
                    </div>
                )
            )}
        </div>
    )
}

export default LessonList