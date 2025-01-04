import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"
import { ProductStatus, ProductType } from "@prisma/client";
import React from "react";
import LessonMenu from "@/components/course-student/lesson-menu";

async function checkifUserHasAccessToCurseIfYesReturnCourse(courseSlug:string){
    const session = await auth()
    const user = session?.user
    if (!user || !user.id) redirect(`/kursy/${courseSlug}`)
    
    const course = await prisma.course.findUnique({
        where: { slug: courseSlug}
    })

    if (!course) redirect(`/kursy`)

    const hasCourse = await prisma.purchasedProducts.findFirst({
        where: {
            userId: user.id,
            productId: course.id,
            productType: ProductType.Course,
            status: ProductStatus.Used
        }
    })

    if (!hasCourse) redirect(`/kursy/${courseSlug}`)

    return course
}

const CourseSlugLayout = async ({ 
    children,
    params 
}:{
    children: React.ReactNode,
    params: { courseSlug: string }
}) => {
    const course = await checkifUserHasAccessToCurseIfYesReturnCourse(params.courseSlug);

  return (
    <div className="w-full h-full flex flex-col">
      <h1>Kurs: {course.slug}</h1>
      <p>{JSON.stringify(course)}</p> {/* Wyświetlanie kursu */}
      <div className="flex-1 overflow-auto">
      {children}
      </div>
    </div>
  );
}
export default CourseSlugLayout;