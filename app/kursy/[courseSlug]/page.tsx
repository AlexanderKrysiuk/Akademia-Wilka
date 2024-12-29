"use client"
import { getPublishedCourseBySlug } from "@/actions/student/course";
import CourseLandingPagePaymentElement from "@/components/payment/course-landing-page";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CourseSlugPage = ({
    params
} : {
    params: {courseSlug: string}
}) => {
    const [course, setCourse] = useState<Course | null>()
    const router = useRouter()
    
    useEffect(()=>{
        getPublishedCourseBySlug(params.courseSlug)
            .then((data)=>setCourse(data))
            .catch((error)=>{
                toast.error(error)
                router.push(`/kursy`)
            })
    },[params.courseSlug, router])

    return ( 
        <main className="space-y-4">
            <Card
                className="aspect-video flex"
            >
                {course?.imageUrl && (
                    <Image
                        src={course.imageUrl}
                        alt={course.title}
                    />
            )}
            </Card>
            <Card>
                <CardHeader>
                    {course?.title}
                </CardHeader>
                <CardBody>
                    {course?.description}
                </CardBody>
            </Card>
            <CourseLandingPagePaymentElement
                courseSlug={params.courseSlug}
                price={100}
            />
            {/*JSON.stringify(course, null,2)*/}
        </main>
     );
}
 
export default CourseSlugPage;