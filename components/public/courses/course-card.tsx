import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { Course, Category, Level } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/link";
import { ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BuyCourseButton from "@/components/Course/buy-course-button";
import { useCurrentUser } from "@/hooks/user";
import PreviewCourseButton from "@/components/Course/preview-course";

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
        <Link href={`/kurs/${slugify(course.title)}`}>
            <Card>
                <CardHeader className="px-0 py-0">
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
                    {purchased ? (
                        <div>

                            Tak
                        </div>
                    ):(
                        <div>
                        </div>
                    )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default CourseCard;
