"use client"

import { Lesson } from "@prisma/client";

const LessonDisplay = ({
    lesson
} : {
    lesson: Lesson
}) => {
    return (
        <div>
            {JSON.stringify(lesson,null,2)}
        </div>
    );
}
 
export default LessonDisplay;