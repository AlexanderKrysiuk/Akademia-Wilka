"use client"

import { Chapter, Course, Lesson, LessonType } from "@prisma/client";

interface LessonPageProps {
    params: {
      courseSlug: string;
      chapterSlug: string;
      lessonSlug: string;
    };
    course: Course;
    chapters: Chapter[];
    lessons: Lesson[];
    completedLessons: string[];
  }

  const LessonPage = ({ params, course, chapters, lessons, completedLessons }: LessonPageProps) => {
   
    return (
        <pre>
            {JSON.stringify(completedLessons,null,2)}
            {JSON.stringify(params,null,2)}
        </pre>
            
    )
    
    {/*
    const { chapterSlug, lessonSlug } = params;
  
    // Znajdź odpowiedni rozdział po chapterSlug
    const chapter = chapters.find((chapter) => chapter.slug === chapterSlug);
    
    if (!chapter) {
      return <div>Nie znaleziono rozdziału.</div>;
    }
  
  // Znajdź odpowiednią lekcję po lessonSlug w kontekście chapterId
  const lesson = lessons.find((lesson) => lesson.slug === lessonSlug && lesson.chapterId === chapter.id);
  
    if (!lesson) {
      return <div>Nie znaleziono lekcji.</div>;
    }
  
    // Sprawdź, czy lekcja została ukończona
    const completed = completedLessons.includes(lesson.id);
  
    // Renderuj różne komponenty w zależności od typu lekcji
    switch (lesson.type) {
      case LessonType.Video:
        //return <VideoLesson lesson={lesson} completed={completed} />;
      case LessonType.Text:
        //return <TextLesson lesson={lesson} completed={completed} />;
      case LessonType.Subchapter:
        //return <QuizLesson lesson={lesson} completed={completed} />;
      default:
        return <div>Nieobsługiwany typ lekcji.</div>;
    }
  };
    */}
}
export default LessonPage;