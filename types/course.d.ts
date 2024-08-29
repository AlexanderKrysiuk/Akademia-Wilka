import { Course, Chapter } from '@prisma/client';
export interface ExtendedCourse extends Course {
    chapter: Chapter[]
}