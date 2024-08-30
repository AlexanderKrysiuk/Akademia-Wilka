import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { Course, Category, Level } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/link";
import { ImageIcon } from "lucide-react";

interface CourseCardProps {
    course: Course;
    category: Category;
    level: Level;
    chapterCount: number;
    lessonCount: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, category, level, chapterCount, lessonCount }) => {
    return (
        <Link href={`/kurs/${slugify(course.title)}`}>
            <Card>
                <CardHeader>
                    {course.imageUrl ? (
                        <div className='relative aspect-video'>
                            <Image
                                fill
                                className='object-cover rounded-lg'
                                alt={course.title}
                                src={course.imageUrl}
                            />
                        </div>
                    ):(
                        <div className='h-full flex items-center justify-center bg-primary/10 rounded-l-lg'>
                            <ImageIcon className='h-[5vh] w-[5vh]'/>
                        </div>
                    )}
                    <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                    <div>Kategoria: {category.name}</div>
                    <div>Poziom: {level.name}</div>
                    <div>Rozdziały: {chapterCount}</div>
                    <div>Lekcje: {lessonCount}</div>
                </CardContent>
                
                <CardFooter>
                    {formatPrice(course.price!)}
                </CardFooter>
            </Card>
        </Link>
    );
};

export default CourseCard;
