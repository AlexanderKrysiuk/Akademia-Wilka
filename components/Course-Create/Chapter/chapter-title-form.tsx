"use client"

import { UpdateChapterTitle } from "@/actions/chapter-teacher/chapter-title";
import { EditChapterTitleSchema } from "@/schemas/chapter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react";
import { startTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type FormFields = z.infer<typeof EditChapterTitleSchema>

const ChapterTitleForm = ({
    chapterId,
    title,
    onUpdate
} : {
    chapterId:string
    title:string
    onUpdate: () => void
}) => {   
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: {title}, 
        resolver: zodResolver(EditChapterTitleSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async ()=>{
            await UpdateChapterTitle(data, chapterId)
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody>
                <Input {...register("title")}
                    label="Tytuł"
                    labelPlacement="outside"
                    type="text"
                    placeholder="Aerodynamika"
                    isRequired
                    isClearable
                    disabled={isSubmitting}
                    variant="bordered"
                    isInvalid={errors.title ? true : false}
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
export default ChapterTitleForm;