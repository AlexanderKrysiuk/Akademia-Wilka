"use client"

import { getCoureBySlug } from "@/actions/course/course"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Course } from "@prisma/client"
import { ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image";
import { Separator } from "@radix-ui/react-dropdown-menu"

const CourseTitlePage = ({
    params
}:{
    params: {CourseSlug:string}
}) => {
    const [course, setCourse] = useState<Course>()
    const router = useRouter()

    const fetchCourse = async () => {
        const course = await getCoureBySlug(params.CourseSlug);
        if(!course){
            router.push("/")
            return
        }
        setCourse(course)
    }

    useEffect(()=>{
        fetchCourse();
    },[])

    if (!course) {
        return <div>Ładowanie</div>
    }

    return ( 
        <div className="px-[1vw] py-[1vh] md:px-[10vw] space-y-[2vh]">
            <h1>
            {course.title}
            </h1>
            <div className="grid md:grid-cols-3 gap-x-[1vw]">
                <div className="md:col-span-2 space-y-[2vh]">
                    <Card>
                        {course.imageUrl ? (
                            <div className="relative aspect-video">
                                <Image
                                    fill
                                    className="object-cover rounded-md"
                                    alt={course.title}
                                    src={course.imageUrl}
                                />
                            </div>
                        ):(
                            <div className="aspect-video flex items-center justify-center bg-primary/10 rounded-md">
                                <ImageIcon className="h-[10vh] w-[10vh]"/>
                            </div>
                        )}
                    </Card>
                    {course.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    O kursie
                                </CardTitle>
                            </CardHeader>
                            <Separator/>
                            <CardContent>
                                <div dangerouslySetInnerHTML={{ __html: course.description }} />
                            </CardContent>
                        </Card>
                    )}
                    
                </div>
            
            </div>
            <div className="my-40">
            {JSON.stringify(course, null, 2)}

            </div>
        </div>
     );
}
 
export default CourseTitlePage;