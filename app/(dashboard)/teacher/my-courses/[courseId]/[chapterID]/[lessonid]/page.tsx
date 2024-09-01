"use client"

import { getLessonByID } from "@/actions/course/lesson"
import { Chapter, Course, Lesson } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const LessonIDPage = ({
    params
}:{
    params: {lessonID: string}
}) => {
    const [lesson, setLesson] = useState<Lesson>()
    const [chapter, setChapter] = useState<Chapter>()
    const [course, setCourse] = useState<Course>()

    const fetchLesson = async () => {
        const lesson = await getLessonByID(params.lessonID);
        if(!lesson){
            toast.error("Nie znaleziono lekcji!")
            return null;
        }
        setLesson(lesson)
    }

    useEffect(()=>{
        fetchLesson();
    },[])
}