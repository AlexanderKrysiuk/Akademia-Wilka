"use client"

import { Divider } from "@nextui-org/divider";
import { Progress } from "@nextui-org/react";
import { Chapter, Course, Lesson } from "@prisma/client";

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
    return (
            //{JSON.stringify(course,null,2)}
        <main className="flex flex-col ">
            <div className="p-4">
                <span className="text-xl">
                    {course.title}
                </span>
                <Progress
                    color={completedLessons.length /lessons.length === 1 ? "success" : "primary"}
                    label={`(${completedLessons.length}/${lessons.length})`}
                    showValueLabel={true}
                    value={completedLessons.length / lessons.length * 100}
                />
            </div>
            <Divider/>
            <ul>
            {chapters.map((chapter) => (
          <li key={chapter.id}>
            <h2>{chapter.title}</h2>
            <Divider/>
            <ul>
              {lessons
                .filter((lesson) => lesson.chapterId === chapter.id)
                .map((lesson) => (
                  <li key={lesson.id}>
                    {lesson.title}
                    <Divider/>
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