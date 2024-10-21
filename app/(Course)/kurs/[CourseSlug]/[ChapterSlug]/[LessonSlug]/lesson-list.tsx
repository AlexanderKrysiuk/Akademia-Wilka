{/* 
"use client"

import { getPublishedLessonsByChapterID } from "@/actions/course/lesson"
import { getCompletedLessonsByChapterID } from "@/actions/course/progress"
import { Card } from "@/components/ui/card"
import { useCurrentUser } from "@/hooks/user"
import { Lesson, LessonType } from "@prisma/client"
import { Eye, Loader2, Lock, MonitorPlay } from "lucide-react"
import { useEffect, useState } from "react"

interface LessonListProps {
    course: {
        id:string
        slug:string
    }
    chapter: {
        id:string
    },
    onLessonsCount?: (count: number) => void; // Dodaj callback do przekazywania liczby lekcji
}

interface completedLessons {
    lessonId: string
}

const LessonList = ({
    course,
    chapter,
    onLessonsCount // Dodaj ten prop
}:LessonListProps) => {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [completedLessons, setCompletedLessons] = useState<completedLessons[]>([])

    const user = useCurrentUser()

    const fetchLessons = async () => {
        setLoading(true)
        const lessons = await getPublishedLessonsByChapterID(chapter.id)
            try {
                const user = useCurrentUser()
                const completedLessons = await getCompletedLessonsByChapterID(chapter.id, user.id)
                setCompletedLessons(completedLessons)
            } catch {
                
            }

        setLessons(lessons)
        if (onLessonsCount) {
            onLessonsCount(lessons.length)
        }
        setLoading(false)
    }



    
    
    useEffect(()=>{
        fetchLessons();
    },[])
    
    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center w-full my-[1vh]">
                    <Loader2 className="animate-spin mr-2"/>
                    Ładowanie...
                </div>
            ):(
                lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <Card className="border-x-0 rounded-none px-[1vw] py-[1vh]">
                            <div className="flex justify-between space-x-[1vw]">
                                {lesson.type === LessonType.Video && (
                                    <MonitorPlay/>
                                )}
                                <div className="w-full">
                                    {lesson.title}
                                </div>
                                {lesson.free ? (
                                    <Eye/>
                                ):(
                                    <Lock/>
                                )}
                            </div>
                        </Card>
                    ))
                ):(
                    <div className="flex items-center justify-center w-full my-[1vh]">
                        Brak lekcji do wyświetlenia...
                    </div>
                )
            )}
            {
                JSON.stringify(completedLessons,null,2)
            }
            
        </div>
    )
}

export default LessonList;
*/}