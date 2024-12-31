import { Course, Chapter } from '@prisma/client';
export interface ExtendedCourse extends Course {
    chapter: Chapter[]
}

export interface CourseRequiredFields {
    title: string;
    slug: string;
    imageUrl: string;
    category: string;
    subject: string;
    level: string;
    hasPublicChapter: boolean;
  }
  