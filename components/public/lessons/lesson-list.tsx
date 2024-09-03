"use client"

import { getPublishedLessonsByChapterID, getPublishedLessonsByCourseID } from "@/actions/course/lesson"
import { Lesson, LessonType } from "@prisma/client"
import { Eye, Lock, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { MonitorPlay } from 'lucide-react';
import { ExtendedLesson } from "@/types/lesson"
import { formatTime } from "@/utils/time"

interface LessonListProps {
    chapter: {
        id:string
    }
}

const LessonList = ({
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
                            <div className="flex items-center justify-between w-full my-[2vh] space-x-[1vw]">
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
                            </div>
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