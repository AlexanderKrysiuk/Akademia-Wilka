"use client"
import { EditCourseTitle } from "@/actions/course-teacher";
import { EditCourseTitleSchema } from "@/schema/course";
import { Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type FormFields = z.infer<typeof EditCourseTitleSchema>

const EditCourseTitleForm = ({
    courseId,
    title
} : {
    courseId: string
    title: string
}) => {
    const router = useRouter()
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
        resolver: zodResolver(EditCourseTitleSchema),
        defaultValues: {
            courseId, // Przekazanie ID kursu
            title // Aktualny tytuł
        }
    })
    
    const submit: SubmitHandler<FormFields> = async (data) => {
        try {
            await EditCourseTitle(data)
            toast.success("Tytuł kursu został zmieniony")
            router.refresh()
        } catch (error) {
            setError("root", { message: error instanceof Error ? error.message : "Wystąpił nieznany błąd" })
        }
    }

    return <Form onSubmit={handleSubmit(submit)}>
        <Input {...register("title")}
            label="Tytuł"
            labelPlacement="outside"
            type="text"
            placeholder="Rocket Science"
            variant="bordered"
            isRequired
            isClearable
            isDisabled={isSubmitting}
            isInvalid={!!errors.title || !!errors.root}
            errorMessage={errors.title?.message || errors.root?.message}
            fullWidth
        />
        <Button
            type="submit"
            color="primary"
            isDisabled={isSubmitting || !watch("title") || watch("title") === title}
            isLoading={isSubmitting}
            className="text-white"
        >
            {isSubmitting ? "Przetwarzanie..." : "Zmień tytuł"}
        </Button>
    </Form>;
}
 
export default EditCourseTitleForm;