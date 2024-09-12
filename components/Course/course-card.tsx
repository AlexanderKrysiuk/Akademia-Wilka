import { getCourseById } from "@/actions/course/get"
import { Course } from "@prisma/client"
import { ImageIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, CardFooter, CardHeader } from "../ui/card"
import Image from "next/image";
import { Separator } from "../ui/separator"
import CourseActionButton from "./course-action-button"
import Link from "next/link"


interface CourseCardProps {
    courseID: string
}

export const CourseCard = ({
    courseID
}:CourseCardProps) => {
    const [course, setCourse] = useState<Course | null>()
    const [loading, setLoading] = useState(true)

    const fetchCourse = async () => {
        const fetchedCourse = await getCourseById(courseID)
        setCourse(fetchedCourse)
    }

    useEffect(()=>{
        setLoading(true)
        fetchCourse()
        setLoading(false)
    },[])

    return (
        <div className="justify-start flex w-full">
            {loading ? (
                <div className="flex">
                    <Loader2 className="animate-spin mr-[1vw]"/>
                    Ładowanie ...
                </div>
            ):(
                course && (
                    <Card className="w-full">
                        <Link href={`/kurs/${course.slug}`}>
                            {course.imageUrl ? (
                                <div className="relative aspect-video rounded-t">
                                    <Image
                                        fill
                                        className="object-cover"
                                        alt={course.title}
                                        src={course.imageUrl}
                                    />
                                </div>
                            ):(
                                <div className='w-full flex items-center justify-center bg-primary/10 rounded-t aspect-video'>
                                    <ImageIcon className='h-[5vh] w-[5vh] object-fill'/>
                                </div>
                            )}
                        </Link>
                    <CardHeader>
                        {course.title}
                    </CardHeader>
                    <Separator/>
                    <CardHeader>
                        <CourseActionButton
                            courseSlug={course.slug}
                            courseId={course.id}
                            />
                    </CardHeader>
                </Card>
                )
            )}
        </div>
    )
}



{/* 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { Course, Category, Level } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/link";
import { ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/user";
import PreviewCourseButton from "@/components/Course/preview-course";
import CoursePurchaseButton from "@/components/Course/course-purchase-button";

interface CourseCardProps {
    course: Course;
    category: Category;
    level: Level;
    chapterCount: number;
    lessonCount: number;
    purchased: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, category, level, chapterCount, lessonCount, purchased }) => {
    const user = useCurrentUser()
    
    return (
        <Card>
        <CardHeader className="px-0 py-0">
        <Link href={`/kurs/${slugify(course.title)}`}>
        {course.imageUrl ? (
            <div className='relative aspect-video rounded-t'>
            <Image
            fill
            className='object-cover rounded-lg'
            alt={course.title}
            src={course.imageUrl}
            />
            </div>
        ):(
            <div className='h-full flex items-center justify-center bg-primary/10 rounded-t-lg aspect-video'>
            <ImageIcon className='h-[5vh] w-[5vh]'/>
            </div>
        )}
        <h6 className="px-[1vh]">{course.title}</h6>
        </Link>
            </CardHeader>    
            <CardContent className="flex items-center justify-between py-[1vh]">
            <div>
            {formatPrice(course.price!)}    
            </div>
            <div>
            <PreviewCourseButton
            course={course}
            />
            </div>
            </CardContent>
            <Separator/>
            <CardFooter>
            <div className="items-center justify-between w-full">
            <CoursePurchaseButton
            price={course.price!}
            courseId={course.id}
            />
            
            
           
                    </div>
                </CardFooter>
                </Card>
            );
        };
        
        export default CourseCard;
        
    */}