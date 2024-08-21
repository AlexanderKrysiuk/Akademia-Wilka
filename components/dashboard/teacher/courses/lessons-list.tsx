"use client"

import { getLessonsByChapterID } from "@/actions/course/lesson";
import { Button } from "@/components/ui/button";
import { Lesson, LessonType } from "@prisma/client";
import { useEffect, useState } from "react";
import AddLessonForm from "./lesson/add-lesson-form";
import { SquarePlus } from "lucide-react";

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
        {JSON.stringify(lessons)}
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