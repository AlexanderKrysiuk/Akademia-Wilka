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
    // Check if mediaURLs is an array before checking its length
    const requiredFields = [
        lesson.title,
        ...(lesson.type !== LessonType.Subchapter ? [lesson.slug] : []), // Add slug for other types
        ...(lesson.type === LessonType.Video && Array.isArray(lesson.media) && lesson.media.length === 0 ? [false] : []) // Check if it's an array
    ]
    const completedFields = requiredFields.filter(Boolean).length

    useEffect(() => {
        if (completedFields < requiredFields.length && lesson.published) {
            unpublishLesson(lesson.id)
            toast.warning("Lekcja zmieniła status na szkic, uzupełnij wszystkie pola, aby ją opublikować.")
        }
    }, [completedFields, requiredFields.length, lesson.published, lesson.id]) // Added dependencies

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
