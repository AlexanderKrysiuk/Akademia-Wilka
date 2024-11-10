"use client"

import { UpdateLessonTitle } from "@/actions/lesson-teacher/lesson-title"
import { EditLessonTitleSchema } from "@/schemas/lesson"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react"
import { startTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof EditLessonTitleSchema>

const LessonTitleCard = ({
    lessonId,
    title,
    onUpdate
} : {
    lessonId: string
    title: string
    onUpdate: () => void
}) => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: {title},
        resolver: zodResolver(EditLessonTitleSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async()=>{
            await UpdateLessonTitle(data, lessonId)
            .then((data)=>{
                toast.success("Zmieniono tytuł")
                onUpdate()
            })
            .catch((error)=>{
                toast.error(error.message)
                setError("title",error)
            })
        })
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Input {...register("title")}
                        label="Tytuł"
                        labelPlacement="outside"
                        type="text"
                        placeholder="Teoria względności"
                        isRequired
                        isClearable
                        isDisabled={isSubmitting}
                        variant="bordered"
                        isInvalid={errors.title ? true : false}
                        errorMessage={errors.title?.message}
                    />
                </CardBody>
                <CardFooter>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Przetwarzanie..." : "Zmień tytuł"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
export default LessonTitleCard