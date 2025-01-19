"use client"

import { UpdateLessonTitle } from "@/actions/lesson-teacher/lesson-title"
import { FormField } from "@/components/ui/form"
import { EditLessonTitleSchema } from "@/schemas/lesson"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, CardBody, CardFooter, Input } from "@heroui/react"
import { Lesson } from "@prisma/client"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof EditLessonTitleSchema>

const LessonTitleCard = ({
    id,
    title
} : {
    id: string
    title: string,
}) => {
    const router = useRouter()
    const {register, handleSubmit, setError, watch, formState: {errors, isSubmitting}} = useForm<FormFields>({
        defaultValues: {title},
        resolver: zodResolver(EditLessonTitleSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (fields) => {
        startTransition(async()=>{
            await UpdateLessonTitle(fields, id)
            .then(()=>{
                toast.success("Zmieniono tytuł")
                router.refresh()
            })
            .catch((error)=>{
                toast.error(error.message)
                setError("title",error)
            })
        })
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody>
                <Input
                    {...register("title")}
                    label="Tytuł"
                    labelPlacement="outside"
                    type="text"
                    placeholder="Teoria względności"
                    isRequired
                    isClearable
                    isDisabled={isSubmitting}
                    variant="bordered"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                />
            </CardBody>
            <CardFooter>
                <Button
                    type="submit"
                    color="primary"
                    isDisabled={isSubmitting || watch("title") === title}
                    isLoading={isSubmitting}
                >
                    {isSubmitting ? "Przetwarzanie..." : "Zmień tytuł"}
                </Button>
            </CardFooter>
        </form>
    );
}
 
export default LessonTitleCard;