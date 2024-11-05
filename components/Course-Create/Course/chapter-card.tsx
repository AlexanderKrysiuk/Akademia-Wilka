"use client"

import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Chapter } from "@prisma/client";
import { Car, Scroll, SquarePen, SquarePlus } from "lucide-react";
import CreateChapterModal from "./create-chapter-modal";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { startTransition, useEffect, useState } from "react";
import { reOrderChapters } from "@/actions/chapter-teacher/chapter";
import { toast } from "react-toastify";

const ChapterCard = ({
    courseId,
    chapters : initialChapters,
    onUpdate,
    onChapterCreate
} : {
    courseId: string,
    chapters: Chapter[],
    onUpdate: () => void,
    onChapterCreate: () => void
}) => {
    const [chapters, setChapters] = useState<Chapter[]>(initialChapters);

    useEffect(() => {
        // Aktualizacja stanu, gdy `initialChapters` się zmienia
        setChapters(initialChapters);
    }, [initialChapters]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(chapters);
        const [reorderedItems] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItems)

        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items)

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }))

        startTransition(()=>{
            reOrderChapters(bulkUpdateData)
            .then((data)=>{
                toast.success("Zmieniono kolejność rozdziałów")
            })
            .catch((error)=>{
                toast.error(error.message)
            })
        })
    }
    return (
        <Card>
            <CardHeader className="flex w-full justify-between">
                <div>Rozdziały kursu</div>
                <CreateChapterModal
                    courseId={courseId}
                    onUpdate={onChapterCreate}
                />
            </CardHeader>
            <CardBody>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="chapters">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {chapters.map((chapter,index) =>(
                                    <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                        {(provided) => (
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
                                                            {chapter.title}
                                                        </div>
                                                        <div>
                                                            {chapter.published ? (
                                                                "Opublikowano"
                                                            ) : (
                                                                "Szkic"
                                                            )}
                                                        </div>
                                                        <div className="flex items-center hover:text-primary transition duration-300">
                                                            <SquarePen/>
                                                        </div>

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
            <Divider/>
            {JSON.stringify(chapters, null,2)}
        </Card>
    );
}
 
export default ChapterCard;