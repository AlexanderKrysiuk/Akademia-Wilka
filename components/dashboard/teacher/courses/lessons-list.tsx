"use client"

import { getLessonsByChapterID } from "@/actions/course/lesson";
import { Button } from "@/components/ui/button";
import { Lesson, LessonType } from "@prisma/client";
import { useEffect, useState } from "react";
import AddLessonForm from "./lesson/add-lesson-form";
import { BookOpenText, NotepadText, SquarePen, SquarePlus, Tv, Volume2, X } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface LessonsListProps {
    chapterID: string
    userID: string
}

const LessonsList = ({
    chapterID,
    userID
}: LessonsListProps) => {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [addLessonModal, setAddLessonModal] = useState(false)

    const fetchLessons = async () => {
        const lessons = await getLessonsByChapterID(chapterID)
        setLessons(lessons)
    }

    useEffect(()=>{
        fetchLessons();
    },[])
    
    return ( 
        
    <div className="flex flex-col px-[1vw] py-[1vh]">
        {/* {JSON.stringify(lessons)} */}
        <DragDropContext onDragEnd={()=>{}}>
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
    </div> );
}
 
export default LessonsList;