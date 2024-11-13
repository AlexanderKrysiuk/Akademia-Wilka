"use client"

import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { startTransition, useEffect, useState } from "react"
import CreateLessonModal from "./lesson-create-modal"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import { Eye, EyeOff, Scroll, SquarePen } from "lucide-react"
import Link from "next/link"
import { reOrderLessons } from "@/actions/lesson-teacher/lesson"
import { toast } from "react-toastify"
import DeleteLessonModal from "./lesson-delete-modal"

const LessonsCard = ({
    courseId,
    chapterId,
    lessons: initialLessons,
    onUpdate,
} : {
    courseId: string,
    chapterId: string,
    lessons: Lesson[],
    onUpdate: () => void
}) => {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons)

    useEffect(()=>{
        setLessons(initialLessons)
    }, [initialLessons])

    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return

        const items = Array.from(lessons)
        const [reorderedItems] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItems)

        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)

        const updatedLessons = items.slice(startIndex, endIndex + 1);

        setLessons(items)

        const bulkUpdateData = updatedLessons.map((lesson)=>({
            id: lesson.id,
            position: items.findIndex((item) => item.id === lesson.id)
        }))

        startTransition(()=>{
            reOrderLessons(bulkUpdateData)
            .then((data)=>{
                toast.success("Zmieniono kolejność lekcji")
            })
            .catch((error)=>{
                toast.error(error.message)
            })
        })
    }

    return (
        <main>
            <CardBody>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="lessons">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {lessons.map((lesson,index)=>(
                                    <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                        {(provided)=>(
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={provided.draggableProps.style as React.CSSProperties}
                                                className="mb-1"
                                            >
                                                <Card>
                                                    <CardHeader className="gap-x-[1vw]">
                                                        <div {...provided.dragHandleProps} className="hover:text-primary transition duration-300">
                                                            <Scroll/>
                                                        </div>
                                                        <div className="truncate w-full">
                                                            {lesson.title}
                                                        </div>
                                                        <div>
                                                            {lesson.published ? (
                                                                <Eye/>
                                                            ) : (
                                                                <EyeOff/>
                                                            )}
                                                        </div>
                                                        <Link href={`./${chapterId}/${lesson.id}`} className="flex items-center hover:text-primary transition duration:300">
                                                            <SquarePen/>
                                                        </Link>
                                                        <DeleteLessonModal
                                                            courseId={courseId}
                                                            chapterId={chapterId}
                                                            lesson={lesson}
                                                            onUpdate={onUpdate}
                                                        />
                                                    </CardHeader>
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
                <CreateLessonModal
                    chapterId={chapterId}
                    onUpdate={onUpdate}
                />
            </CardFooter>
        </main>
    )
}
export default LessonsCard;