"use client"
import CreateCourseModal from "@/components/teacher/create-course/create-course-modal";
import { Button, Card, CardFooter, CardHeader, Link } from "@heroui/react";
import { Course } from "@prisma/client";
const MyCoursesWrapper = ({
    courses
} : {
    courses: Course[]
}) => {
    return ( 
        <main className="p-4 space-y-4">
            <CreateCourseModal/>
            {courses.length > 0 ? (
                courses.map((course)=>(
                    <Card className="flex" key={course.id}>
                        <CardHeader>
                            {course.title}
                        </CardHeader>
                        <CardFooter>
                            <Button
                                color="primary"
                                className="text-white"
                                as={Link}
                                href={`/nauczyciel/moje-kursy/${course.id}`}
                            >
                                Edytuj
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <p className="w-full flex items-center justify-center">
                    Brak kursów do wyświetlenia
                </p>
            )}
            {JSON.stringify(courses,null,2)}     
        </main>
    );
}
 
export default MyCoursesWrapper;