{/*
// pages/kurs/[CourseSlug].tsx
"use client";

import { getCourseBySlug } from "@/actions/course/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@prisma/client";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import ChapterList from "@/components/public/chapters/chapter-list";
import { Preview } from "@/components/editor";
import { formatPrice } from "@/lib/format";
import CourseActionButton from "@/components/Course/course-action-button";
import CourseUserProgress from "@/components/Course/course-user-progress";
import StripeEmbeddedCheckout from "@/components/Course/payment-component";

const CourseTitlePage = ({
  params,
}: {
  params: { CourseSlug: string };
}) => {
  const [course, setCourse] = useState<Course>();
  const router = useRouter();

  const fetchCourse = async () => {
    const course = await getCourseBySlug(params.CourseSlug);
    if (!course) {
      router.push("/");
      return;
    }
    setCourse(course);
  };

  useEffect(() => {
    fetchCourse();
  }, [params]);

  if (!course) {
    return <div>Ładowanie</div>;
  }

  return (
    <div className="px-[1vw] py-[1vh] md:px-[10vw] space-y-[2vh]">
      <h1>{course.title}</h1>
      <div className="grid md:grid-cols-2 gap-x-[1vw]">
        <div className="md:col-span-1 space-y-[2vh]">
          <Card>
            {course.imageUrl ? (
              <div className="relative aspect-video">
                <Image
                  fill
                  className="object-cover rounded-md"
                  alt={course.title}
                  src={course.imageUrl}
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-primary/10 rounded-md">
                <ImageIcon className="h-[10vh] w-[10vh]" />
              </div>
            )}
          </Card>
          {course.description && (
            <Card>
              <CardHeader>
                <CardTitle>O kursie</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <Preview value={course.description} />
              </CardContent>
            </Card>
          )}
          <ChapterList course={course} />
        </div>
        <div>
          <Card>
            <CardHeader className="bg-foreground/5">
              {course.price! > 0 ? formatPrice(course.price!) : <div></div>}
            </CardHeader>
            <CardContent className="bg-foreground/5">
              <CourseUserProgress courseID={course.id} />
              <CourseActionButton courseSlug={course.slug} courseId={course.id} />
            </CardContent>
          </Card>
          StripeEmbeddedCheckout nowy komponent
          <Card>
            <StripeEmbeddedCheckout courseId={course.id} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseTitlePage;
*/}
