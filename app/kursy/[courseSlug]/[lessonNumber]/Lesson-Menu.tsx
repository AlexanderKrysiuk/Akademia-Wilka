"use client"

import { Button, Divider, Image, Progress } from "@heroui/react";
import { Course, Lesson } from "@prisma/client";
import { Circle, CircleCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";

const LessonMenu = ({
    course,
    lessons,
    completedLessonsIds,
    lessonNumber
} : {
    course: Course
    lessons: Lesson[]
    completedLessonsIds: string[]
    lessonNumber: number
}) => {
    const router = useRouter()
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
                {lessons.map((lesson) => {
                    const completed = completedLessonsIds.includes(lesson.id);
                    const selected = lesson.order === lessonNumber;
                    return (
                        <li key={lesson.id}>
                            <Button
                                fullWidth
                                radius="none"
                                color={completed ? "success" : "default"}
                                startContent={completed ? <CircleCheckBig /> : <Circle />}
                                size="sm"
                                variant={selected ? "flat" : "light"}
                                className="justify-start"
                                onPress={()=>{router.push(`/kursy/${course.slug}/lekcja-${lesson.order}`)}}
                            >
                                {lesson.title}
                            </Button>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
 
export default LessonMenu;