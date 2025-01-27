import { auth } from "@/auth";
import { Course, ProductStatus, ProductType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import LoginForm from "@/components/auth/login-form";
import LoginPage from "@/app/auth/login/page";
import StartPage from "@/app/auth/start/page";
import { Button, Card, CardBody, CardFooter, CardHeader, Link, Progress } from "@heroui/react";
import { AddToCartButton } from "@/components/cart/cart";
import ActivateCourseButton from "@/components/Course-Landing-Page/activate-course-button";

const activateCourse = async(courseId:string) => {
    const session = await auth()
    const user = session?.user

    if (!user || !user.id) throw new Error("Niezalogowany");

    const activeOrderItem = await prisma.orderItem.findFirst({
        where: {
            userId: user.id,
            productId: courseId,
            productType: ProductType.Course,
            status: ProductStatus.Active,
        },
    });

    if (!activeOrderItem) {
        throw new Error("Nie znaleziono aktywnego kursu do aktywacji.");
    }

    // Aktualizacja statusu na "Used"
    await prisma.orderItem.update({
        where: {
            id: activeOrderItem.id,
        },
        data: {
            status: ProductStatus.Used,
        },
    });
}

const CourseAccessElement = async ({
    course
} : {
    course: Course
}) => {
    const session = await auth()
    const user = session?.user

    if (!user) return (
        <main className="space-y-4">
            <Card>
                <CardHeader>
                    Uzyskaj dostęp do kursu za {course.price} zł
                </CardHeader>
                <CardFooter>
                    <AddToCartButton 
                        id={course.id}
                        type={ProductType.Course}
                        quantity={1} 
                        image={course.imageUrl!}
                        title={course.title}
                        price={course.price || 0}                
                    />
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    Masz już kurs? Zaloguj się
                </CardHeader>
                <CardBody>
                    <LoginForm/>
                </CardBody>
            </Card>
        </main>
    )

    const CourseStatus = await prisma.orderItem.findFirst({
        where: {
            userId: user.id,
            productId: course.id,
            productType: ProductType.Course
        }
    })

    if (!CourseStatus) {
        return (
            <Card>
                <CardHeader>
                    Uzyskaj dostęp do kursu za {course.price} zł
                </CardHeader>
                <CardFooter>
                    <AddToCartButton 
                        id={course.id}
                        type={ProductType.Course}
                        quantity={1} 
                        image={course.imageUrl!}
                        title={course.title}
                        price={course.price || 0}                
                    />
                </CardFooter>
            </Card>
        )
    }

    if (CourseStatus.status === ProductStatus.Active) {
        return (
            <Card
                fullWidth
            >
                <CardHeader>
                    Masz już ten kurs
                </CardHeader>
                <CardFooter>
                    <ActivateCourseButton
                        courseId={course.id}
                    />
                </CardFooter>
            </Card>
        )
    }

    if (CourseStatus.status === ProductStatus.Used) {
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
            <Card
                fullWidth
            >
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
                        href={`/kursy/${course.slug}/lekcja-${nextLesson!.order}`}
                        className="text-white"
                    >
                        Przejdź do kursu
                    </Button>
                </CardFooter>
            </Card>
        )
    }
}
 
export default CourseAccessElement;