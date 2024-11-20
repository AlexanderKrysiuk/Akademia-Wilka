"use client"

import { UpdateChapterSlug } from "@/actions/chapter-teacher/chapter-slug";
import { UpdateChapterTitle } from "@/actions/chapter-teacher/chapter-title";
import { EditChapterSlugSchema } from "@/schemas/chapter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react";
import { startTransition, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatSlug } from "@/lib/slug";
import { z } from "zod";

type FormFields = z.infer<typeof EditChapterSlugSchema>

const ChapterSlugForm = ({
    courseId,
    chapterId,
    slug,
    onUpdate
} : {
    courseId:string
    chapterId:string
    slug:string | null
    onUpdate: () => void
}) => {   
    const { register, handleSubmit, setError, setValue, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: {slug: slug || undefined}, 
        resolver: zodResolver(EditChapterSlugSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async ()=>{
            await UpdateChapterSlug(data, courseId, chapterId)
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
                    placeholder="aerodynamika"
                    isRequired
                    isClearable
                    disabled={isSubmitting}
                    variant="bordered"
                    isInvalid={errors.slug ? true : false}
                    errorMessage={errors.slug?.message}
                    value={watch("slug")}
                    onValueChange={(value)=>{setValue("slug", formatSlug(value))}}
                />
            </CardBody>
            <CardFooter>
                <Button 
                    type="submit" 
                    color="primary" 
                    isDisabled={isSubmitting || watch("slug") === slug} 
                    isLoading={isSubmitting}>
                    {isSubmitting ? "Przetwarzanie..." : "Zmień odnośnik"}
                </Button>
            </CardFooter>
        </form>
     );
}
export default ChapterSlugForm;