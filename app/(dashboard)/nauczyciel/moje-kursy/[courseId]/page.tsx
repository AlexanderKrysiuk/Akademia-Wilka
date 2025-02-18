import { auth } from "@/auth";
import CreateCourseWrapper from "./create-course-wrapper";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const CreateCoursePage = async ({ params }: { params: { courseId: string } }) => {
    const session = await auth()
    const user = session?.user
    if (!user) redirect("/auth/start")
    
    const course = await prisma.course.findUnique({
        where: { id: params.courseId }
    })

    if (!course || course.ownerId !== user.id && user.role !== Role.Admin) redirect("/nauczyciel/moje-kursy")

    return <CreateCourseWrapper/>
}
 
export default CreateCoursePage;