"use client"

import { getLessonsByChapterID } from "@/actions/course/lesson";
import { Lesson } from "@prisma/client";
import { useEffect, useState } from "react";

interface LessonsListProps {
    chapterID: string
    userID: string
}

const LessonsList = ({
    chapterID,
    userID
}: LessonsListProps) => {
    const [lessons, setLessons] = useState<Lesson[]>([])

    const fetchLessons = async () => {
        const lessons = await getLessonsByChapterID(chapterID)
        setLessons(lessons)
    }

    useEffect(()=>{
        fetchLessons();
    },[])
    
    return ( 
        
    <div>
        {JSON.stringify(lessons)}
    </div> );
}
 
export default LessonsList;