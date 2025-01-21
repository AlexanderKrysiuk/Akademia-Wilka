import { prisma } from "@/lib/prisma";
import { Card, CardFooter, CardHeader, Image, Link } from "@heroui/react";
import { ImageOff } from "lucide-react";

const CoursesPage = async () => {
    const courses = await prisma?.course.findMany({
        where: {
            published: true
        }
    })

    return (
        <main className="mx-auto max-w-7xl lg:px-[10vw] pt-4">
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {courses.map((course) => (
                        <Card
                            isPressable
                            isHoverable
                            as={Link}
                            key={course.id}
                            href={`/kursy/${course.slug}`}
                        >
                            <Image
                                fallbackSrc={<ImageOff/>}
                                src={course.imageUrl!}
                                alt={course.title}

                            />
                            <CardHeader
                                className="flex justify-between p-4 transition-all duration-300"
                            >
                                <h3
                                    className="text-lg font-medium transition-colors duration-300 group-hover:text-primary"
                                    >
                                    {course.title}
                                </h3>
                                
                
                            </CardHeader>
                            <p>{course.description}</p>
                            <CardFooter className="gap-4">
                                {/*
                                <Button
                                    size="sm"
                                    color="primary"
                                    fullWidth
                                >
                                    kup kurs <ShoppingCart/>
                                </Button>
                                <Button
                                    size="sm"
                                    color="primary"
                                    isIconOnly
                                >
                                    <ShoppingCart/>
                                </Button>
                                <Button
                                    size="sm"
                                    color="primary"
                                    variant="faded"
                                    isIconOnly
                                >
                                    <Gift/>
                                </Button>
                    */}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex w-full justify-center">
                    Brak kursów do wyświetlenia
                </div>
            )}
            <pre>
                {/*JSON.stringify(courses,null,2)*/}
            </pre>
        </main>
    );
}
 
export default CoursesPage;