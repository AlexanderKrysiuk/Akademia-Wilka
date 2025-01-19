"use client"

import { Button, Divider, Link, Progress } from "@heroui/react";
import { Course, Lesson, LessonType } from "@prisma/client";
import { Circle, CircleCheckBig } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const LessonMenu = ({
    course,
    lessons,
    completedLessonsIds
} : {
    course: Course
    lessons: Lesson[]
    completedLessonsIds: string[]
}) => {
    const router = useRouter()
    const pathname = usePathname()

    const renderLessonButton = (lesson: Lesson) => {
        const completed = completedLessonsIds.includes(lesson.id)
        const selected = pathname === `/kursy/${course.slug}/lekcja-${lesson.order}`
        switch (lesson.type) {
            case LessonType.Video:
                return (
                    <Button
                        fullWidth
                        radius="none"
                        color={completed ? "success" : "default"}
                        startContent={completed ? <CircleCheckBig/> : <Circle/>}
                        size="sm"
                        variant={selected ? "flat" : "light"}
                        className="justify-start"
                        as={Link}
                        href={`/kursy/${course.slug}/lekcja-${lesson.order}`}
                    >
                        {lesson.title}
                    </Button>
                )
        }
    }
    return (
        <main className="flex flex-col">
            <div className="p-4">
                <span className="text-xl">
                    {course.title}
                </span>
                <Progress
                    color={completedLessonsIds.length /lessons.length === 1 ? "success" : "primary"}
                    label={`(${completedLessonsIds.length}/${lessons.length})`}
                    showValueLabel={true}
                    value={completedLessonsIds.length / lessons.length * 100}
                />
            </div>
            <Divider/>
            <ul>
                {lessons.map((lesson)=>(
                    <li key={lesson.id}>
                        {renderLessonButton(lesson)}
                    </li>
                ))}
            </ul>
        </main>
    );
}
 
export default LessonMenu;