"use client"

import { Divider } from "@nextui-org/divider";
import { Button, Link, Progress } from "@nextui-org/react";
import { Chapter, Course, Lesson, LessonType } from "@prisma/client";
import { Circle, CircleCheckBig } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const LessonMenu = ({
    course,
    chapters,
    lessons,
    completedLessons,
} : {
    course: Course
    chapters: Chapter[]
    lessons: Lesson[]
    completedLessons: string[]
}) => {
    const router = useRouter()
    const pathname = usePathname();
    const filteredLessons = lessons.filter((lesson) => lesson.type !== LessonType.Subchapter);


    const renderLessonButton = (lesson: Lesson, chapterSlug: string | null) => {
        const completed = completedLessons.includes(lesson.id)
        const selected = pathname === `/kurs/${course.slug}/${chapterSlug}/${lesson.slug}`;
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
                onPress={() =>
                  router.push(`/kurs/${course.slug}/${chapterSlug}/${lesson.slug}`)
                }
              >
                {lesson.title}
              </Button>
            );
    
          default:
            return (
              <Button
                fullWidth
                radius="none"
                size="md"
                variant="light"
                isDisabled
                className="justify-start font-semibold"
              >
                {lesson.title}
              </Button>
            );
        }
      };

    return (
            //{JSON.stringify(course,null,2)}
        <main className="flex flex-col">
            <div className="p-4">
                <span className="text-xl">
                    {course.title}
                </span>
                <Progress
                    color={completedLessons.length /filteredLessons.length === 1 ? "success" : "primary"}
                    label={`(${completedLessons.length}/${filteredLessons.length})`}
                    showValueLabel={true}
                    value={completedLessons.length / filteredLessons.length * 100}
                />
            </div>
            <Divider/>
            <ul>
                {chapters.map((chapter) => (
                    <li key={chapter.id}>
                        <Button
                            fullWidth
                            size="lg"
                            radius="none"
                            variant="light"
                            isDisabled
                            className="justify-start font-extrabold"
                        >
                            {chapter.title}

                        </Button>
                        <ul>
                            {lessons
                            .filter((lesson) => lesson.chapterId === chapter.id)
                            .map((lesson) => (
                                <li key={lesson.id}>
                                    {renderLessonButton(lesson, chapter.slug)}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </main>
    );
}
 
export default LessonMenu;