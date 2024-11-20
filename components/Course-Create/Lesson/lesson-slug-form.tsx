"use client"

import { UpdateLessonSlug } from "@/actions/lesson-teacher/lesson-slug"
import { formatSlug } from "@/lib/slug"
import { EditLessonSlugSchema } from "@/schemas/lesson"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, CardBody, CardFooter, Input } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { startTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof EditLessonSlugSchema>

const LessonSlugForm = ({
    lesson,
    onUpdate
}:{
    lesson: Lesson
    onUpdate: () => void
}) => {
    const { register, handleSubmit, setError, setValue, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: {slug: lesson.slug || undefined},
        resolver: zodResolver(EditLessonSlugSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async()=>{
            await UpdateLessonSlug(data, lesson.chapterId, lesson.id)
            .then((data)=>{
                toast.success("Zmieniono odnośnik")
                onUpdate()
            })
            .catch((error)=>{
                toast.error(error.message)
                setError("slug",error)
            })
        })
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody>
                <Input {...register("slug")}
                    label="Unikalny odnośnik"
                    labelPlacement="outside"
                    type="text"
                    placeholder="teoria-wzglednosci"
                    isRequired
                    isClearable
                    isDisabled={isSubmitting}
                    variant="bordered"
                    isInvalid={errors.slug ? true : false}
                    errorMessage={errors.slug?.message}
                    value={watch("slug")}
                    onValueChange={(value)=>{setValue("slug",formatSlug(value))}}
                />
            </CardBody>
            <CardFooter>
                <Button
                    type="submit"
                    color="primary"
                    isDisabled={isSubmitting || watch("slug") === lesson.slug}
                    isLoading={isSubmitting}
                >
                    {isSubmitting ? "Przetwarzanie..." : "Zmień odnośnik"}
                </Button>
            </CardFooter>
        </form>
    )
}
export default LessonSlugForm