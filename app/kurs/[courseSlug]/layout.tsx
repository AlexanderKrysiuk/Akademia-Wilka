import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"
import { ProductStatus, ProductType } from "@prisma/client";
import React from "react";
import CourseLayoutWrapper from "@/components/course-student/course-layout-wrapper";

async function checkifUserHasAccessToCurseIfYesReturnCourse(courseSlug:string){
    const session = await auth()
    const user = session?.user
    if (!user || !user.id) redirect(`/kursy/${courseSlug}`)
    
    const extendedCourse = await prisma.course.findUnique({
        where: { slug: courseSlug},
        include: {
            chapters: {
                where: { published: true },
                include: {
                    lessons: {
                        where: { published: true }
                    }
                }
            }
        }
    })

    if (!extendedCourse) redirect(`/kursy`)

    const hasCourse = await prisma.purchasedProducts.findFirst({
        where: {
            userId: user.id,
            productId: extendedCourse.id,
            productType: ProductType.Course,
            status: ProductStatus.Used
        }
    })

    if (!hasCourse) redirect(`/kursy/${courseSlug}`)

    const { chapters, ...course } = extendedCourse;
    const lessons = chapters.flatMap((chapter) => chapter.lessons);

    // Pobranie statusu ukończonych lekcji
    const userProgress = await prisma.userCourseProgress.findMany({
        where: {
            userId: user.id,
            lessonId: { in: lessons.map((lesson) => lesson.id) },
            completed: true,
        },
    });

    const completedLessons = new Set(userProgress.map((progress) => progress.lessonId));

    return {
        props: {
            course,
            chapters,
            lessons,
            completedLessons: Array.from(completedLessons),
        }
    }
}

const CourseSlugLayout = async ({ 
    children,
    params 
}:{
    children: React.ReactNode,
    params: { courseSlug: string }
}) => {
    const extendedCourse = await checkifUserHasAccessToCurseIfYesReturnCourse(params.courseSlug);

  return (
    <div className="w-full h-full flex flex-col border-green-500 border-2">
      {/*
      <h1>Kurs: {course.slug}</h1>
      <p>{JSON.stringify(course)}</p>
      */}
      <div className="flex-1 overflow-auto">
        <CourseLayoutWrapper 
            course={extendedCourse.props.course} 
            chapters={extendedCourse.props.chapters} 
            lessons={extendedCourse.props.lessons}
            completedLessons={extendedCourse.props.completedLessons}
        >
            {children}
        </CourseLayoutWrapper>
      </div>
    </div>
  );
}
export default CourseSlugLayout;