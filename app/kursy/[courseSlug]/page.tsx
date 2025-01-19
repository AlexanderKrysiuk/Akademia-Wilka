
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { ImageOff, VideoOff } from "lucide-react";
import { ImageNotFound } from "@/utils/Page-Placeholders";
import { auth } from "@/auth";
import { ProductStatus, ProductType } from "@prisma/client";
import CourseAccessElement from "./course-access-element";

const CourseSlugPage = async ({
    params
} : {
    params: {courseSlug: string}
}) => {
    const course = await prisma.course.findUnique({
        where: {slug: params.courseSlug}
    })
    if (!course) redirect(`/kursy`)

    return (
        <main className="mx-auto max-w-7xl lg:px-[10vw] w-full pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                <div className="lg:col-span-7 space-y-4">
                    {course.imageUrl ? (
                        <Image
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full"
                        />
                    ) : (
                        <ImageNotFound/>
                    )}
                    <Card>
                        <CardHeader>
                            <span className="text-xl">{course.title}</span>
                        </CardHeader>
                        <CardBody>
                            {course.description}
                        </CardBody>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <CourseAccessElement
                        course={course}
                    />
                </div>    
            </div>
        </main>
    )
}
export default CourseSlugPage;