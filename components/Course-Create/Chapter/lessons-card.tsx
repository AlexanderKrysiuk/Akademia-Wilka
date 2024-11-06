"use client"

import { Card, CardHeader } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { useEffect, useState } from "react"
import CreateLessonModal from "./create-lesson-modal"

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
        </Card>
    )
}
export default LessonsCard;