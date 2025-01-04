"use server";

import { prisma } from "@/lib/prisma";

export async function getLessonsWithProgressForCourse(courseId: string, userId: string) {
  // Pobierz wszystkie opublikowane lekcje z opublikowanych rozdziałów danego kursu
  const lessons = await prisma.lesson.findMany({
    where: {
      chapter: {
        courseId: courseId,
        published: true,
      },
      published: true,
    },
  });

  // Pobierz ukończone lekcje użytkownika w ramach danego kursu
  const completedLessons = await prisma.userCourseProgress.findMany({
    where: {
      userId,
      lessonId: {
        in: lessons.map((lesson) => lesson.id),
      },
      completed: true
    },
    select: {
      lessonId: true,
    },
  });

  // Utwórz listę ukończonych lekcji na podstawie ich ID
  const completedLessonIds = completedLessons.map((progress) => progress.lessonId);

  return {
    lessons,
    completedLessonIds
    //completedLessons: lessons.filter((lesson) => completedLessonIds.includes(lesson.id)),
  };
}
