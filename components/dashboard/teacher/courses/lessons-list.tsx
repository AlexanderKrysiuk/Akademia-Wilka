"use client"

import { getLessonsByChapterID, reOrderLessons } from "@/actions/course/lesson";
import { Button } from "@/components/ui/button";
import { Lesson, LessonType } from "@prisma/client";
import { startTransition, useEffect, useState } from "react";
import AddLessonForm from "./lesson/add-lesson-form";
import { BookOpenText, Loader2, NotepadText, SquarePen, SquarePlus, Tv, Volume2, X } from "lucide-react";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { toast } from "@/components/ui/use-toast";
import DeleteLessonForm from "./lesson/delete-lesson-form";

interface LessonsListProps {
    chapterID: string
    userID: string
}

const LessonsList = ({
    chapterID,
    userID
}: LessonsListProps) => {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [lesson, setLesson] = useState<Lesson>()
    const [addLessonModal, setAddLessonModal] = useState(false)
    const [deleteLessonModal, setDeleteLessonModal] = useState(false)

    const fetchLessons = async () => {
        const lessons = await getLessonsByChapterID(chapterID)
        setLessons(lessons)
    }

    useEffect(()=>{
        fetchLessons();
    },[])

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(lessons);
        const [reorderedItems] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItems)

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index)

        const updatedLessons = items.slice(startIndex, endIndex + 1);

        setLessons(items)

        const bulkUpdatedData = updatedLessons.map((lesson)=>({
            id: lesson.id,
            position: items.findIndex((item) => item.id === lesson.id)
        }))

        startTransition(()=>{
            reOrderLessons(bulkUpdatedData, userID, chapterID)
            .then((data) => {
                toast({
                    title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                    description: data.message,
                    variant: data.success? "success" : "failed",
                });
            })
        })
    }

    const deleteLesson = (lesson: Lesson) => {
        setLesson(lesson)
        setDeleteLessonModal(true)
    }

    if (!lessons) {
        return (
            <div className="flex items-center justify-center">
                <Loader2 className="animate-spin" />
                <span> Ładowanie lekcji... </span>
            </div>
        )
    }
    
    return ( 
        
    <div className="flex flex-col px-[1vw] py-[1vh]">
        {/* {JSON.stringify(lessons)} */}
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lessons">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {lessons.map((lesson,index) => (
                            <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} className="mb-[1vh]">
                                        <div className="flex justify-between items-center bg-primary/10 rounded-md px-[1vw] py-[1vh] gap-x-[1vw]">
                                            <div {...provided.dragHandleProps} className="hover:text-primary transition duration-300">
                                                {lesson.type === LessonType.Text && (
                                                    <NotepadText/>
                                                )}
                                                {lesson.type === LessonType.Subchapter && (
                                                    <BookOpenText/>
                                                )}
                                                {lesson.type === LessonType.Audio && (
                                                    <Volume2/>
                                                )}
                                                {lesson.type === LessonType.Video && (
                                                    <Tv/>
                                                )}
                                            </div>
                                            <div className="truncate w-full">
                                                {lesson.title}
                                            </div>
                                            

                                            <div className="flex items-center hover:text-primary transition duration-300">
                                                <SquarePen
                                                    className="cursor-pointer"
                                                    />
                                            </div>
                                            <div className="flex items-center hover:text-red-500 transition duration-300">
                                                <X
                                                    className="cursor-pointer"
                                                    onClick={() => deleteLesson(lesson)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
        <div className="flex">
        <Button
            className="gap-x-[1vw]"
            onClick={() => {
                setAddLessonModal(true)
            }}
            size={`sm`}
            >
            <SquarePlus/> Dodaj Treść
        </Button>       
        </div>
        {addLessonModal && (
            <AddLessonForm
                chapterID={chapterID}
                userID={userID}
                onUpdate={() => {
                    fetchLessons();
                    setAddLessonModal(false)
                }}
                onClose = {() => setAddLessonModal(false)}
            />
        )}
        {deleteLessonModal && (
            <DeleteLessonForm
                userID={userID}
                lesson={lesson}
                onClose={() => setDeleteLessonModal(false)}
                onUpdate={()=>{
                    fetchLessons()
                    setDeleteLessonModal(false)
                }}
            />
        )}
    </div> );
}
 
export default LessonsList;