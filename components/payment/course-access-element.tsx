"use client";

import { checkIfUserHasCourse } from "@/actions/student/course";
import StartPage from "@/app/auth/start/page";
import { useCurrentUser } from "@/hooks/user";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import PageLoader from "../page-loader";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link, Progress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Course, Lesson } from "@prisma/client";
import { CreateCoursePaymentPage } from "@/actions/stripe/course";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "@/schemas/user";
import { z } from "zod";
import LoginForm from "../auth/login-form";
import { getLessonsWithProgressForCourse } from "@/actions/student/user-course-progress";

const CourseAccessElement = ({ course }: { course: Course }) => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [hasCourse, setHasCourse] = useState(false);
  const [loginForm, setLoginForm] = useState(false)
  const [isPending, startTransition] = useTransition();
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  const { register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm<FormFields>({resolver: zodResolver(EmailSchema)})
  const router = useRouter();

  const getNextLessonSlug = (lessons: Lesson[], completedLessonIds: string[]) => {
    // Znajdź pierwszą lekcję, której nie ma na liście ukończonych
    const nextLesson = lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
  
    // Jeśli wszystkie lekcje ukończone, zwróć ostatnią lekcję
    const targetLesson = nextLesson || lessons[lessons.length - 1];
  
    return `/kursy/${course.slug}/lekcja-${targetLesson.order}`;
  };

  type FormFields = z.infer<typeof EmailSchema>

  const handlePayment = (email?:string) => {
    startTransition(async () => {
      try {
        const result = await CreateCoursePaymentPage(course.slug!, email);

        if (!result?.props.checkoutUrl) {
          throw new Error("Nie udało się utworzyć sesji płatności.");
        }

        router.push(result.props.checkoutUrl);
      } catch (error) {
        toast.error("Błąd podczas inicjalizacji płatności.");
        console.error(error);
      }
    });
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

  // useEffect(async () => {
  //   await checkIfUserHasCourse(course.id)
  //     .then((data) => {
  //       if(data && user && user.id) {
  //         const lessonsData = await getLessonsWithProgressForCourse(course.id, user.id)
  //         setLessons(lessons)
  //       }
  //       setHasCourse(data)
  //     })
  //     .catch((error) => {
  //       //toast.error("Nie udało się sprawdzić dostępu do kursu.");
  //       console.error(error);
  //     })
  //     .finally(() => setLoading(false));
  // }, [course.id, user]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const hasCourseAccess = await checkIfUserHasCourse(course.id);
        setHasCourse(hasCourseAccess);
  
        if (hasCourseAccess && user?.id) {
          const { lessons, completedLessonIds } = await getLessonsWithProgressForCourse(course.id, user.id);
          setLessons(lessons);
          setCompletedLessons(completedLessonIds);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Błąd przy ładowaniu danych o kursie.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourseData();
  }, [course.id, user]);
  

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <div className="w-full text-center">Uzyskaj dostęp do kursu za: {course.price}zł</div>
        </CardHeader>
        <CardBody>
          {loginForm ? (
            <div className="space-y-4">
              <LoginForm/>
              <Link
                underline="always"
                className="w-full justify-center cursor-pointer"
                onClick={()=>{setLoginForm(false)}}
              >
                wróć do zakupu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
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
                  autoComplete="email" />
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Przetwarzanie..." : "Przejdź do płatności"}
                </Button>
              </form>
              <Link
                underline="always"
                className="w-full justify-center cursor-pointer"
                onClick={()=>{setLoginForm(true)}}
              >
                masz już konto?
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  if (loading) return <PageLoader />;

  return hasCourse ? (
    <Card>
      <CardBody>
        <CardHeader className="flex w-full justify-center">
          Postęp w kursie
        </CardHeader>
        <Progress
          label={`(${completedLessons.length}/${lessons.length})`}
          value={completedLessons.length / lessons.length * 100}
          showValueLabel={true}
          color={completedLessons.length / lessons.length === 1 ? "success" : "primary"}
        />
      </CardBody>
      <CardFooter>
        <Button className="w-full text-white" color="success">
          Przejdź do kursu
        </Button>
      </CardFooter>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <div className="w-full text-center">Uzyskaj dostęp do kursu za: {course.price}zł</div>
      </CardHeader>
      <CardBody className="flex flex-col items-center">
      <Button color="primary" fullWidth onClick={()=>{handlePayment()}} disabled={isPending}>
          {isPending ? "Przekierowanie..." : "Przejdź do płatności"}
        </Button>
      </CardBody>
    </Card>
  );
};

export default CourseAccessElement;
