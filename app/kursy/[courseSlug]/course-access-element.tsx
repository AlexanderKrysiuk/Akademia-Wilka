import { auth } from "@/auth";
import { Course, ProductStatus, ProductType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import LoginForm from "@/components/auth/login-form";
import LoginPage from "@/app/auth/login/page";
import StartPage from "@/app/auth/start/page";
import { Button, Card, CardBody, CardFooter, CardHeader, Link, Progress } from "@heroui/react";

const activateCourse = async(courseId:string) => {
    const session = await auth()
    const user = session?.user

    if (!user || !user.id) throw new Error("Niezalogowany");

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if (!course) throw new Error("Nie znaleziono kursu")

    const hasCourse = await prisma.user.findFirst({
        where: {
            id: user.id,
            courses: {
                some: {
                    id: course.id
                }
            }
        }
    })

    if (hasCourse) return new Error("Masz już dostęp do tego kursu")

    const productToActivate = await prisma.purchasedProducts.findFirst({
        where: {
            
        }
    })
}

const CourseAccessElement = async ({
    course
} : {
    course: Course
}) => {
    const session = await auth()
    const user = session?.user

    if (!user) return (
        <Card>
            <CardHeader
                className="justify-center flex flex-col"
            >
                <span
                    className="text-xl"
                >
                    Masz już kurs?
                </span>
                <span
                    className="justify-center"
                >
                    Zaloguj się aby uzyskać dostęp
                </span>
            </CardHeader>
            <CardBody>
                <LoginForm/>
            </CardBody>
        </Card>
    )

    const hasCourse = await prisma.user.findFirst({
        where: {
            id: user.id,
            courses: {
                some: {
                    id: course.id
                }
            }
        }
    })

    if (hasCourse) {
        // Pobierz wszystkie lekcje ukończone przez użytkownika z tego kursu
        const completedLessons = await prisma.lesson.findMany({
            where: {
                completedByUsers: {
                    some: {
                        id: user.id
                    }
                },
                courseId: course.id, // Tylko lekcje z danego kursu
                published: true
            },
            select: {
                id: true,
                order: true
            }
        })

        // Pobierz wszystkie lekcje z tego kursu
        const allLessons = await prisma.lesson.findMany({
            where: {
                courseId: course.id,
                published: true
            },
            select: {
                id: true,
                order: true
            },
            orderBy: {
                order: "asc"
            }
        })

        // Tworzymy zestaw ukończonych lekcji
        const completedLessonIds = new Set(completedLessons.map((lesson) => lesson.id));

        // Znajdź pierwszą nieukończoną lekcję
        let nextLesson = allLessons.find(
            (lesson) => !completedLessonIds.has(lesson.id)
        );
        if (!nextLesson) {
            // Jeśli wszystkie lekcje są ukończone, wybierz ostatnią lekcję
            nextLesson = allLessons[allLessons.length - 1];
        }

        return (
            <Card>
                <CardHeader>
                    <span
                        className="text-xl justify-center w-full flex"
                    >
                        Twój postęp w kursie
                    </span>
                </CardHeader>
                <CardBody>
                    <Progress
                        value={completedLessons.length/allLessons.length*100}
                        label={`(${completedLessons.length}/${allLessons.length})`}
                        showValueLabel
                        color={completedLessons.length < allLessons.length ? "primary" : "success"}
                    />
                </CardBody>
                <CardFooter>
                    <Button
                        fullWidth
                        color="primary"
                        as={Link}
                        href={`/kursy/${course.slug}/lekcja-${nextLesson.order}`}
                        className="text-white"
                    >
                        Przejdź do kursu
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    const hasCourseToActivate = await prisma.purchasedProducts.findFirst({
        where: {
            userId: user.id,
            productId: course.id,
            productType: ProductType.Course,
            status: ProductStatus.Active
        }
    })

    if (hasCourseToActivate) {
        return (
            <Card>
                <CardHeader
                    className="flex flex-col"
                >
                    <span 
                        className="text-xl w-full justify-center flex"
                    >
                        Masz już kupiony kurs
                    </span>
                    <span
                        className="w-full flex justify-center"
                    >
                        kliknij aby go aktywować
                    </span>
                </CardHeader>
                <CardFooter>
                    <Button
                        fullWidth
                        color="primary"
                        className="text-white"

                    >
                        Aktywuj kurs
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return ( 
        <main>
            ZALOGOWANY
        </main>
     );
}
 
export default CourseAccessElement;