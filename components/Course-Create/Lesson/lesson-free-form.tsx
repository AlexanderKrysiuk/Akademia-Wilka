"use client"

import { UpdateLessonFreeStatus } from "@/actions/lesson-teacher/lesson-free"
import { Button, CardBody, CardFooter, Checkbox } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { startTransition } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { validate } from "uuid"

type FormFields = {
    isFree: boolean
}

const LessonFreeForm = ({
    lesson,
    onUpdate
} : {
    lesson: Lesson,
    onUpdate: () => void
}) => {
    const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormFields>({
        defaultValues: { isFree: lesson.free }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async ()=>{
            await UpdateLessonFreeStatus(data.isFree, lesson.id)
                .then((response)=>{
                    if (response === false) {
                        toast.info("Lekcja nie należy już do darmowych")
                    } else {
                        toast.success("Lekcja zmieniła status na darmową")
                    }
                })
                .catch((error)=>{
                    toast.error(error?.message)
                })
                .finally(
                    onUpdate
                )
        })
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody>
                <Controller
                    name="isFree"
                    control={control}
                    render={({field})=>(
                        <Checkbox
                            isSelected={field.value}
                            onValueChange={field.onChange}
                            color="primary"
                        >
                            Lekcja darmowa
                        </Checkbox>
                    )}
                />
            </CardBody>
            <CardFooter>
                <Button type="submit" color="primary" isDisabled={isSubmitting || watch("isFree") === lesson.free}>
                    Zapisz zmiany
                </Button>
            </CardFooter>
        </form>
    )
}
export default LessonFreeForm