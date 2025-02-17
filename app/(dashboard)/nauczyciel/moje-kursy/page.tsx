"use server"
import { prisma } from "@/lib/prisma";
import MyCoursesWrapper from "./my-courses-wrapper";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const MyCoursesPage = async () => {
    const session = await auth()
    const user = session?.user

    if (!user || user.role !== Role.Admin) redirect("/auth/start")

    const courses = await prisma.course.findMany({
        where: {ownerId: user.id}
    })
    
    return ( 
        <MyCoursesWrapper
            courses={courses}
        />
     );
}
 
export default MyCoursesPage;