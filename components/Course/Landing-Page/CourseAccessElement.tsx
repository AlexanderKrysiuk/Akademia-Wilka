"use client"
import { CreateCoursePaymentPage } from "@/actions/stripe/course";
import { activateCourseById, checkIfUserHasBoughtCourse, checkIfUserHasCourse, checkIfUserHasCourseIfYesReturnHisProgress, getCourseAccessStatus } from "@/actions/student/course";
import LoginForm from "@/components/auth/login-form";
import { useCurrentUser } from "@/hooks/user";
import { EmailSchema } from "@/schemas/user";
import { PageLoader } from "@/utils/Page-Placeholders";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link, Progress } from "@nextui-org/react";
import { Course, Lesson } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const CourseAccessElement = ({ 
    course 
} : { 
    course:Course
}) => {
    const user = useCurrentUser()
    const router = useRouter()
    const { register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm<FormFields>({resolver: zodResolver(EmailSchema)})

    const [loading, setLoading] = useState(true)
    const [loginForm, setLoginForm] = useState(false)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [completedLessons, setCompletedLessons] = useState<Lesson[]>([])
    const [hasCourseToActivate, setHasCourseToActivate] = useState(false)
    const [isPending, setIsPending] = useState(false)

    useEffect(()=>{
        async function CheckIfUserHasCourse(){
            try {
                const result = await getCourseAccessStatus(course.id)
                if (result.allLessons && result.completedLessons) {
                    setLessons(result.allLessons)
                    setCompletedLessons(result.completedLessons)
                } else {
                    if (result.status) {
                        setHasCourseToActivate(true)
                    }
                }
            } catch(error) {
                console.error("Błąd podczas sprawdzania dostępu do kursu:", error)
                toast.error("Wystąpił problem podczas sprawdzania dostępu.")
            } finally {
                setLoading(false)
            }
        }
        if (user) {
            CheckIfUserHasCourse()
        } else {
            setLoading(false)
        }
    },[course.id, user])

    type FormFields = z.infer<typeof EmailSchema>

    const findFirstUncompletedLesson = (allLessons: Lesson[], completedLessons: Lesson[]) => {
        // Utwórz zestaw ukończonych lekcji
        const completedOrderSet = new Set(completedLessons.map(lesson => lesson.order));
    
        // Przejdź przez wszystkie lekcje, aby znaleźć pierwszą, która nie została ukończona
        for (let lesson of allLessons) {
            if (!completedOrderSet.has(lesson.order)) {
                return lesson.order; // Zwróć order pierwszej nieukończonej lekcji
            }
        }
        return null; // Jeśli wszystkie lekcje zostały ukończone, zwróć null
    };
    
    const firstUncompletedLessonOrder = findFirstUncompletedLesson(lessons, completedLessons);

    const activateCourse = async () => {
        setIsPending(true)
            try {
                await activateCourseById(course.id)
                toast.success("Aktywowałeś kurs")
                router.refresh()
            } catch(error) {
                console.error("Aktywacja kursu nie powiodła się:",error)
                toast.error("Aktywacja kursu nie powiodła się")
            } finally {
                setIsPending(false)
            }
    }

    const handlePayment = async (email?:string) => {
        setIsPending(true)
            try {
                const result = await CreateCoursePaymentPage(course.slug!, email);

            if (!result?.props.checkoutUrl) {
                throw new Error("Nie udało się utworzyć sesji płatności.");
            }

                router.push(result.props.checkoutUrl);
            } catch (error) {
                toast.error("Błąd podczas inicjalizacji płatności.");
                console.error(error);
            } finally {
                setIsPending(false)
            }
        //});
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            await checkIfUserHasCourse(course.id, data.email)
                .then((result)=>{
                    if (result) {
                        toast.info("Masz już dostęp do kursu, zaloguj się by móc z niego korzystać.")
                        setLoginForm(true)
                    } else {
                        handlePayment(data.email)
                    }
            })
        } catch (error) {
            console.error("[SUBMITING EMAIL ON LANDING PAGE ERROR]", error)
            toast.error("Wystąpił nieznany błąd")
        }
    }

    if (loading) return <PageLoader/>

    return (
        <Card>
            {user ? (
                lessons.length > 0 ? (
                    <>
                        <CardHeader className="flex w-full justify-center">
                            Postęp w kursie
                        </CardHeader>
                        <CardBody>
                            <Progress
                                label={`(${completedLessons.length}/${lessons.length})`}
                                value={completedLessons.length / lessons.length * 100}
                                showValueLabel={true}
                                color={completedLessons.length / lessons.length === 1 ? "success" : "primary"}
                            />
                        </CardBody>
                        <CardFooter>
                            <Button 
                                className="w-full text-white" 
                                color="success"
                                as={Link}
                                href={`/kursy/${course.slug}/lekcja-${firstUncompletedLessonOrder}`}
                            >
                                Przejdź do kursu
                            </Button>
                        </CardFooter>
                    </>
                ) : (
                    hasCourseToActivate ? (
                        <CardBody>
                            <Button color="primary" fullWidth onPress={()=>{activateCourse()}} disabled={isPending}>
                                {isPending ? "Aktywacja kursu..." : "Aktywuj kurs"}
                            </Button>
                        </CardBody>
                    ) : (
                        <>
                            <CardHeader>
                                <div className="w-full text-center">Uzyskaj dostęp do kursu za: {course.price}zł</div>
                            </CardHeader>
                            <CardBody className="flex flex-col items-center">
                                <Button color="primary" fullWidth onPress={()=>{handlePayment()}} disabled={isPending}>
                                    {isPending ? "Przekierowanie..." : "Przejdź do płatności"}
                                </Button>
                            </CardBody>
                        </>
                    )
                )
            ) : (
                <>
                    <CardHeader>
                        <div className="w-full text-center">Uzyskaj dostęp do kursu za: {course.price}zł</div>
                    </CardHeader>
                    {loginForm ? (
                        <div className="space-y-4">
                            <CardBody>
                                <LoginForm/>
                            </CardBody>
                            <CardFooter>
                                <Link
                                    underline="always"
                                    className="w-full justify-center cursor-pointer"
                                    onPress={()=>{setLoginForm(false)}}
                                    >
                                    wróć do zakupu
                                </Link>
                            </CardFooter>
                        </div>
                    ) : (
                        <div className="">
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                                <CardBody>
                                    <Input {...register("email")}
                                        label="E-mail"
                                        labelPlacement="outside"
                                        type="email"
                                        placeholder="jack.sparrow@pirate.com"
                                        isRequired
                                        isClearable
                                        isDisabled={isSubmitting}
                                        variant="bordered"
                                        isInvalid={errors.email ? true : false}
                                        errorMessage={errors.email?.message}
                                        autoComplete="email" 
                                        />
                                </CardBody>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        fullWidth
                                        isDisabled={isSubmitting}
                                        isLoading={isSubmitting}
                                    >
                                        {isSubmitting ? "Przetwarzanie..." : "Przejdź do płatności"}
                                    </Button>
                                </CardFooter>
                            </form>
                            <CardFooter>
                                <Link
                                    underline="always"
                                    className="w-full justify-center cursor-pointer"
                                    onPress={()=>{setLoginForm(true)}}
                                    >
                                    masz już konto?
                                </Link>
                            </CardFooter>
                        </div>
                    )}
                </>
            )}
        </Card>
    );
}
 
export default CourseAccessElement;