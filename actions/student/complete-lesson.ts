"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const toggleLessonCompletion = async (lessonId: string) => {
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) throw new Error("Niezalogowany");

  
    // Sprawdzanie, czy lekcja jest już ukończona
  const lessons = await prisma.user.findUnique({
    where: { id: user.id },
    select: { completedLessons: { select: { id: true } } }, // Wybieramy tylko ID ukończonych lekcji
  });

  const isCompleted = lessons?.completedLessons.some(lesson => lesson.id === lessonId);

  // Zmieniamy status lekcji
  await prisma.user.update({
    where: { id: user.id },
    data: {
      completedLessons: isCompleted
        ? { disconnect: { id: lessonId } }
        : { connect: { id: lessonId } },
    },
  });

  return !isCompleted; // Jeśli wcześniej była ukończona, zwrócimy 'false', jeśli nie, to 'true'

};