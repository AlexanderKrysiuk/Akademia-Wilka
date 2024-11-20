"use client"

import { unpublishLesson } from "@/actions/lesson-teacher/lesson"
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd"
import { Card, CardHeader } from "@nextui-org/react"
import { Chapter, Lesson, LessonType } from "@prisma/client"
import { Eye, EyeOff, Scroll } from "lucide-react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import LessonEditModal from "./lesson-edit-modal"
import LessonDeleteModal from "./lesson-delete-modal"

const LessonCard = ({
    chapter,
    lesson,
    dragHandleProps,
    onUpdate
}:{
    chapter: Chapter
    lesson: Lesson
    dragHandleProps: DraggableProvidedDragHandleProps | null
    onUpdate: () => void
}) => {
    const requiredFields = [
        lesson.title,
        ...(lesson.type !== LessonType.Subchapter ? [lesson.slug] : []), // Dodaj slug tylko dla innych typów
        ...(lesson.type === LessonType.Video && lesson.mediaURLs.length === 0 ? [false] : []) // Dodaj `false` dla braku URL w wideo
    ]
    const completedFields = requiredFields.filter(Boolean).length

    useEffect(()=>{
        if (completedFields < requiredFields.length && lesson.published) {
            unpublishLesson(lesson.id)
            toast.warning("Leckja zmieniła status na:szkic, uzupełnij wszystkie pola by go opublikować")
        }
        
    },[lesson.id])

    return (
        <Card>
            <CardHeader className="gap-x-2">
                <div {...dragHandleProps}>
                    <Scroll className="hover:text-primary transition duration-300"/>
                </div>
                <div className="truncate w-full">
                    {lesson.title}
                </div>
                <div className="text-sm">
                    {lesson.published ? (
                        <Eye/>
                    ) : (
                        <EyeOff/>
                    )}
                </div>
                
                <LessonEditModal
                    chapter={chapter}
                    lesson={lesson}
                    requiredFields={requiredFields}
                    onUpdate={onUpdate}
                />
                <LessonDeleteModal
                    lesson={lesson}
                    chapter={chapter}
                    onUpdate={onUpdate}
                />
            </CardHeader>
        </Card>
    )
}
export default LessonCard