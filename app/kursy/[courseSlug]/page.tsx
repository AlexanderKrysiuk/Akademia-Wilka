"use client"
import { getPublishedCourseBySlug } from "@/actions/student/course";
import PageLoader from "@/components/page-loader";
import CourseAccessElement from "@/components/payment/course-access-element";
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
    const [loading, setLoading] = useState(true)
    const [course, setCourse] = useState<Course | null>()
    const router = useRouter()
    
    useEffect(()=>{
        getPublishedCourseBySlug(params.courseSlug)
            .then((data)=>setCourse(data))
            .catch((error)=>{
                toast.error(error)
                router.push(`/kursy`)
            })
            .finally(()=>{
                setLoading(false)
            })
    },[params.courseSlug, router])

    if (loading) return <PageLoader/>

    if (!course || !course.imageUrl || !course.title) return

    return ( 
        <main className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Sekcja główna */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="aspect-video">
                        <Image
                            src={course.imageUrl}
                            alt={course.title}
                            className="object-cover w-full h-full"
                        />
                    </Card>
                    <Card>
                        <CardHeader>
                            <h1 className="text-xl font-bold">{course.title}</h1>
                        </CardHeader>
                        <CardBody>
                            <p>{course.description}</p>
                        </CardBody>
                    </Card>
                </div>
                {/* Sekcja płatności */}
                <div className="lg:col-span-2">
                    <CourseAccessElement
                        course={course}
                    />
                </div>
            </div>
        </main>
     );
}
 
export default CourseSlugPage;