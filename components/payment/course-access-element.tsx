"use client";

import { checkIfUserHasCourse } from "@/actions/student/course";
import StartPage from "@/app/auth/start/page";
import { useCurrentUser } from "@/hooks/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLoader from "../page-loader";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

const CourseAccessElement = ({ course }: { course: Course }) => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [hasCourse, setHasCourse] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    checkIfUserHasCourse(user.id, course.id)
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
    <Button className="w-full" color="success">
      Przejdź do kursu
    </Button>
  ) : (
    <Card>
      <CardHeader>
        <div className="w-full text-center">Uzyskaj dostęp do kursu za: {course.price}zł</div>
      </CardHeader>
      <CardBody className="flex flex-col items-center">
        <Button
          color="primary"
          fullWidth
          onClick={async () => {
            try {
              const response = await fetch(`/api/courses/${course.id}/checkout`, {
                method: "POST",
              });

              if (!response.ok) {
                throw new Error("Nie udało się przekierować do płatności.");
              }

              const { checkoutUrl } = await response.json();
              router.push(checkoutUrl);
            } catch (error) {
              toast.error("Błąd podczas inicjalizacji płatności.");
              console.error(error);
            }
          }}
        >
          Przejdź do płatności
        </Button>
      </CardBody>
    </Card>
  );
};

export default CourseAccessElement;
