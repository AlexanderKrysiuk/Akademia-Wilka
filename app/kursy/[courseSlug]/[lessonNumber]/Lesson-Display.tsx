"use client"

import { toggleLessonCompletion } from "@/actions/student/complete-lesson";
import { Button, Divider } from "@nextui-org/react";
import { Course, Lesson } from "@prisma/client";
import { ChevronLeft, ChevronRight, VideoOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const LessonDisplay = ({
    lesson,
    lessons,
    course,
    completedLessonsIds
} : {
    lesson: Lesson
    lessons: Lesson[]
    course: Course
    completedLessonsIds: string[]
}) => {
    // Znajdź indeks bieżącej lekcji
    const router = useRouter()
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);

    // Wyznacz poprzednią i następną lekcję
    const previousLesson = lessons[currentIndex - 1];
    const nextLesson = lessons[currentIndex + 1];
    const completed = completedLessonsIds.includes(lesson.id);
    const media = lesson.media ? JSON.parse(lesson.media as string) : []

    const [submitting, setSubmitting] = useState(false)

    const changeLessonCompletion = async() => {
        setSubmitting(true)
        try {
            const result = await toggleLessonCompletion(lesson.id)
            if (result) {
                toast.success("Ukończono lekcję")
            } else {
                toast.info("Zmieniono lekcję na nieukończoną")
            }
        } catch(error) {
            console.log("Błąd podczas ukończenia lekcji", error)
            toast.error("Wystąpił błąd podczas zmiany statusu lekcji")
        } finally {
            router.refresh()
            setSubmitting(false)
        }
    }

    return (
        <main>
            {media.length > 0 && media[0].url ? (
                <video controls controlsList="nodownload" className="w-full h-full">
                    <source src={media[0].url} type="video/mp4"/>
                </video>
            ) : (
                <div className="w-full h-auto aspect-video bg-primary/10 flex justify-center items-center flex-col">
                    <VideoOff className="w-10 h-auto" />
                    Brak Video
                </div>
            )}            
            <Divider/>
            <div className="gap-4 w-full flex justify-center items-center py-4" >
                {previousLesson && (
                    <Button
                        size="sm"
                        color="primary"
                        className={`text-white`}
                        startContent={<ChevronLeft/>}
                        onPress={()=>{
                            router.push(`/kursy/${course.slug}/lekcja-${previousLesson.order}`)
                        }}
                    >
                        Poprzednia lekcja
                    </Button>
                )}
                <Button
                    size="sm"
                    color="primary"
                    className="text-white"
                    isDisabled={submitting}
                    isLoading={submitting}
                    onPress={()=>{
                        changeLessonCompletion()
                    }}
                >
                    {completed ? "Zmień na nieukończoną" : "Ukończ lekcję"}
                </Button>
                {nextLesson && (
                    <Button
                        size="sm"
                        color="primary"
                        className={`text-white`}
                        endContent={<ChevronRight/>}
                        onPress={()=>{
                            router.push(`/kursy/${course.slug}/lekcja-${nextLesson.order}`)
                        }}
                    >
                        Następna lekcja
                    </Button>
                )}
            </div>
            {/*JSON.stringify(lesson,null,2)*/}
        </main>
    );
}
 
export default LessonDisplay;