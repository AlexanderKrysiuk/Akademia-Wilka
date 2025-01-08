"use client"

import { UpdateCourseTitle } from "@/actions/course-teacher/title";
import { useCurrentUser } from "@/hooks/user";
import { EditCourseTitleSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react";
import { UserRole } from "@prisma/client";
import { Pen, PenOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type FormFields = z.infer<typeof EditCourseTitleSchema>

const TitleCard = ({
    courseId,
    title
} : {
    courseId: string
    title: string
}) => {   
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: { title },
        resolver: zodResolver(EditCourseTitleSchema)
    })
    const router = useRouter()

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(()=>{
            UpdateCourseTitle(data, courseId)
                .then(()=>{
                    toast.success("Tytuł kursu został zmieniony")
                    router.refresh()
                })
                .catch((error)=>{
                    setError("title", {message: error.message})
                    toast.error(error.message)
                })
        })
    }

    return ( 
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Input
                        {...register("title")}
                        label="Tytuł"
                        labelPlacement="outside"
                        type="text"
                        placeholder="Rocket Science"
                        isRequired
                        isClearable
                        disabled={isSubmitting}
                        variant="bordered"
                        isInvalid={!!errors.title}
                        errorMessage={errors.title?.message}
                    />
                </CardBody>
                <CardFooter>
                    <Button
                        type="submit"
                        color="primary"
                        isDisabled={isSubmitting || watch("title") === title || !!errors.title}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Przetwarzanie..." : "Zmień tytuł"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default TitleCard;
