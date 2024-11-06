"use client"

import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { useEffect, useState } from "react"
import CreateLessonModal from "./create-lesson-modal"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { Eye, EyeOff, Scroll, SquarePen } from "lucide-react"
import Link from "next/link"

const LessonsCard = ({
    chapterId,
    lessons: initialLessons,
    onUpdate,
} : {
    chapterId: string,
    lessons: Lesson[],
    onUpdate: () => void
}) => {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons)

    useEffect(()=>{
        setLessons(initialLessons)
    }, [initialLessons])

    return (
        <Card>
            <CardHeader className="flex w-full justify-between flex-col md:flex-row">
                <div>Lekcje rozdziału</div>
                <CreateLessonModal
                    chapterId={chapterId}
                    onUpdate={onUpdate}
                />
            </CardHeader>
            <CardBody>
                <DragDropContext onDragEnd={()=>{}}>
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
                                                        <Link href={`./${chapterId}`} className="flex items-center hover:text-primary transition duration:300">
                                                            <SquarePen/>
                                                        </Link>
                                                    </CardHeader>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardBody>
        </Card>
    )
}
export default LessonsCard;