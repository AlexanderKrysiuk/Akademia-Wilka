import { auth } from "@/auth";
import CreateCourseWrapper from "./create-course-wrapper";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const CreateCoursePage = async (props: { params: Promise<{ courseId: string }> }) => {
    const params = await props.params;
    const session = await auth()
    const user = session?.user
    if (!user) redirect("/auth/start")

    const course = await prisma.course.findUnique({
        where: { id: params.courseId }
    })

    if (!course || course.ownerId !== user.id && user.role !== Role.Admin) redirect("/nauczyciel/moje-kursy")

    const requiredFields = [
        course.title,
        course.slug
    ]

    const completedFields = requiredFields.filter(Boolean)

    if (completedFields.length < requiredFields.length && course.public){
        await prisma.course.update({
            where: {id: course.id},
            data: {public: false}
        })
        course.public = false
    }

    return <CreateCourseWrapper 
        course={course}
        completedFields={completedFields}
        requiredFields={requiredFields}
    />
}
 
export default CreateCoursePage;