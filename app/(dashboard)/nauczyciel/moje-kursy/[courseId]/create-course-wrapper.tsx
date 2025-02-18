"use client"
import { PublishCourse } from "@/actions/course-teacher";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

const CreateCourseWrapper = ({
    course,
    completedFields,
    requiredFields,
} : {
    course: Course
    completedFields: string[]
    requiredFields: string[]
}) => {
    const [pending, startTransition] = useTransition()
    const router = useRouter()

    const handlePublish = () => {
        startTransition(async () => {
            try {
                await PublishCourse(course.id);
                toast.success("Zmieniono status kursu")
                router.refresh()
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)   
                } else {
                    toast.error("Wystąpił nieznany błąd")
                }
            }
        });
    };

    return ( 
        <main className="p-4 space-y-4">
            <Card>
                <CardHeader className="w-full flex justify-between items-center">
                    <div className="truncate">
                        <FontAwesomeIcon icon={faGear} className="mr-2"/>
                        {course.title}
                    </div>
                    <div>
                        <Button
                            onPress={handlePublish}
                            isLoading={pending}
                            isDisabled={pending || completedFields.length < requiredFields.length}
                            color={completedFields.length < requiredFields.length ? "warning" : "success"}
                            className="text-white"
                            size="sm"
                        >
                            {course.public ? "Zmień na szkic" : "Opublikuj"}
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <Progress
                        value={completedFields.length / requiredFields.length * 100}
                        valueLabel={`(${completedFields.length}/${requiredFields.length})`}
                        showValueLabel
                        color={completedFields.length < requiredFields.length ? "warning" : "success"}
                    />
                </CardBody>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    kolumna 1
                </div>
                <div>
                    kolumna 2
                </div>
            </div>
            {JSON.stringify(course,null,2)}
        </main>
     );
}
 
export default CreateCourseWrapper;