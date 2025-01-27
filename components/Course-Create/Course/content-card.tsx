"use client"

import { Card, CardBody, CardFooter, CardHeader, Divider, Select, SelectItem } from "@heroui/react"
import { Lesson, LessonType } from "@prisma/client"
import CreateLessonModal from "../Lesson/lesson-create-modal"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import { startTransition } from "react"
import { reOrderLessons } from "@/actions/lesson-teacher/lesson"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Scroll } from "lucide-react"
import LessonDeleteModal from "../Lesson/lesson-delete-modal"
import LessonEditModal from "../Lesson/lesson-edit-modal"

const ContentCard = ({
    courseId,
    lessons
}: {
    courseId: string
    lessons: Lesson[]
}) => {
    const router = useRouter()

    // Funkcja obsługująca zakończenie przeciągania
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(lessons)
        const [reorderedItems] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItems)

        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)

        const updatedLessons = items.slice(startIndex, endIndex + 1)

        lessons = items

        const bulkUpdateData = updatedLessons.map((lesson) => ({
            id: lesson.id,
            position: items.findIndex((item) => item.id === lesson.id)
        }))


        startTransition(() => {
            reOrderLessons(bulkUpdateData)
                .then(() => {
                    toast.success("Zmieniono kolejność lekcji")
                })
                .catch((error) => {
                    toast.error(error.message)
                })
                .finally(() => {
                    router.refresh()
                })
        })
    }

    return (
        <Card>
            <CardHeader>Zawartość kursu</CardHeader>
            <CardBody>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="lessons">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {lessons.map((lesson, index) => (
                                    <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={provided.draggableProps.style as React.CSSProperties}
                                                className="mb-1"
                                            >
                                                <Card
                                                    radius="sm"
                                                    isHoverable
                                                >
                                                    <div className="flex p-1 gap-2">

                                                        <div {...provided.dragHandleProps}>
                                                            <Scroll className="cursor-grab hover:text-primary transition duration-300"/>
                                                        </div>
                                                        <span className="w-full truncate">{lesson.title}</span>
                                                        <div className="text-sm">
                                                            {lesson.published ? <Eye/> : <EyeOff/>}
                                                        </div>
                                                        <LessonEditModal
                                                            lesson={lesson}
                                                        />
                                                        <LessonDeleteModal
                                                            lesson={lesson}
                                                        />
                                                    </div>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardBody>
            <CardFooter>
                <CreateLessonModal courseId={courseId} />
            </CardFooter>
            <Divider />
            {JSON.stringify(lessons, null, 2)}
        </Card>
    )
}

export default ContentCard
