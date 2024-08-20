"use client"

import { getLessonsByChapterID } from "@/actions/course/lesson";
import { Button } from "@/components/ui/button";
import { Lesson, LessonType } from "@prisma/client";
import { useEffect, useState } from "react";
import AddLessonForm from "./add-lesson-form";

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
    const [lessonType, setLessonType] = useState<LessonType>(LessonType.Subchapter)

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
        <Button
            onClick={() => {
                setLessonType(LessonType.Subchapter)
                setAddLessonModal(true)
            }}
            size={`sm`}
        >
            Dodaj Podrozdział
        </Button>
        {addLessonModal && (
            <AddLessonForm
                chapterID={chapterID}
                userID={userID}
                LessonType={lessonType}
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