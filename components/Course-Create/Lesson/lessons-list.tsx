"use client"

import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react"
import { Chapter, Lesson } from "@prisma/client"
import { startTransition, useEffect, useState } from "react"
import CreateLessonModal from "./lesson-create-modal"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import { Eye, EyeOff, Scroll, SquarePen } from "lucide-react"
import Link from "next/link"
import { GetLessonsByChapterId, reOrderLessons } from "@/actions/lesson-teacher/lesson"
import { toast } from "react-toastify"
import DeleteLessonModal from "./lesson-delete-modal"
import { unpublishChapter } from "@/actions/chapter-teacher/chapter"
import PageLoader from "@/components/page-loader"
import LessonCard from "./lesson-card"

const LessonsList = ({
    chapter,
    lessons : initialLessons,
    onUpdate,
} : {
    chapter: Chapter,
    lessons: Lesson[],
    onUpdate: () => void
}) => {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons)

    useEffect(()=>{
        setLessons(initialLessons)
    },[initialLessons])

    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return

        const items = Array.from(lessons)
        const [reorderedItems] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItems)

        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)

        const updatedLessons = items.slice(startIndex, endIndex + 1);

        setLessons(items)
        //lessons = items

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
            .finally(onUpdate)
        })
    }
    return (
        <main>
            <CardBody>
                {lessons.length > 0 ? (
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
                                                    /*
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        transform: snapshot.isDragging
                                                          ? provided.draggableProps.style?.transform
                                                          : "translate(0, 0)", // Zapewnia brak przesunięć
                                                        transition: snapshot.isDragging
                                                          ? "none" // Usunięcie animacji podczas przeciągania
                                                          : provided.draggableProps.style?.transition,
                                                        zIndex: snapshot.isDragging ? 1000 : "auto", // Przeciągany element na wierzchu
                                                        userSelect: "none", // Zapobiega zaznaczaniu tekstu
                                                      }}
                                                      */
                                                >
                                                    <LessonCard
                                                        chapter={chapter}
                                                        lesson={lesson}
                                                        dragHandleProps={provided.dragHandleProps}
                                                        onUpdate={onUpdate}
                                                    />
                                                    {/*
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
                                                            <Link href={`./${chapter.id}/${lesson.id}`} className="flex items-center hover:text-primary transition duration:300">
                                                                <SquarePen/>
                                                            </Link>
                                                            <DeleteLessonModal
                                                                courseId={chapter.courseId}
                                                                chapterId={chapter.id}
                                                                lesson={lesson}
                                                                onUpdate={onUpdate}
                                                            />
                                                        </CardHeader>
                                                    </Card>
                                                            */}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                ):(
                    <div className="w-full flex justify-center">
                        Brak lekcji
                    </div>
                )}
            </CardBody>
            <CardFooter>
                <CreateLessonModal
                    chapterId={chapter.id}
                    onUpdate={onUpdate}
                />
            </CardFooter>
        </main>
       
    )
}
export default LessonsList;