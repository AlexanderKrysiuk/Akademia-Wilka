"use client"

import { Divider } from "@nextui-org/react"
import { Lesson } from "@prisma/client"

export const LessonDispal = ({ 
    lessonNumber,
    lessons 
} : { 
    lessonNumber: number
    lessons: Lesson[] 
}) => {
    const currentLesson = lessons.find(lesson => lesson.order === lessonNumber)

    return (
      <div>
        {JSON.stringify(lessons,null,2)}
        <Divider/>
        {JSON.stringify(currentLesson,null,2)}
        {currentLesson?.title}
      </div>
    )
  }
  