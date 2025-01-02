"use client";

import { checkIfUserHasCourse } from "@/actions/student/course";
import StartPage from "@/app/auth/start/page";
import { useCurrentUser } from "@/hooks/user";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import PageLoader from "../page-loader";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { CreateCoursePaymentPage } from "@/actions/stripe/course";

const CourseAccessElement = ({ course }: { course: Course }) => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [hasCourse, setHasCourse] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handlePayment = () => {
    startTransition(async () => {
      try {
        const result = await CreateCoursePaymentPage(course.slug!);

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

  useEffect(() => {
    checkIfUserHasCourse(course.id)
      .then((data) => setHasCourse(data))
      .catch((error) => {
        toast.error("Nie udało się sprawdzić dostępu do kursu.");
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [course.id, user]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <div className="w-full text-center">Zaloguj się lub utwórz konto, aby uzyskać dostęp</div>
        </CardHeader>
        <CardBody>
          <StartPage />
        </CardBody>
      </Card>
    );
  }

  if (loading) return <PageLoader />;

  return hasCourse ? (
    <Button className="w-full text-white" color="success">
      Przejdź do kursu
    </Button>
  ) : (
    <Card>
      <CardHeader>
        <div className="w-full text-center">Uzyskaj dostęp do kursu za: {course.price}zł</div>
      </CardHeader>
      <CardBody className="flex flex-col items-center">
      <Button color="primary" fullWidth onClick={handlePayment} disabled={isPending}>
          {isPending ? "Przekierowanie..." : "Przejdź do płatności"}
        </Button>
      </CardBody>
    </Card>
  );
};

export default CourseAccessElement;
