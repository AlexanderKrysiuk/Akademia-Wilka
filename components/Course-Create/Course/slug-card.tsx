"use client"

import { UpdateCourseSlug } from "@/actions/course-teacher/slug"
import { useCurrentUser } from "@/hooks/user"
import { EditCourseSlugSchema } from "@/schemas/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react"
import { UserRole } from "@prisma/client"
import { Pen, PenOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof EditCourseSlugSchema>

const SlugCard = ({
    courseId,
    slug,
} : {
    courseId: string
    slug: string | null
}) => {    
    const router = useRouter()
    // Always call useForm at the top level
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: slug ? { slug } : undefined,
        resolver: zodResolver(EditCourseSlugSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(() => {
            UpdateCourseSlug(data, courseId)
                .then(() => {
                    toast.success("Odnośnik został zmieniony pomyślnie")
                    router.refresh()
                })
                .catch((error) => {
                    setError("slug", { message: error.message })
                    toast.error(error.message)
                })
        })
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                        <Input {...register("slug")}
                            label="Unikalny odnośnik"
                            labelPlacement="outside"
                            type="text"
                            placeholder="rocket-science"
                            isRequired
                            isClearable
                            disabled={isSubmitting}
                            variant="bordered"
                            isInvalid={!!errors.slug}
                            errorMessage={errors.slug?.message}
                            description={`Unikalny odnośnik będzie wyglądał następująco: https://www.akademiawilka.pl/kurs/${watch("slug") || "rocket-science"}/`}
                        />
               
                </CardBody>
                <CardFooter>
                    <Button
                        type="submit"
                        color="primary"
                        isDisabled={isSubmitting || watch("slug") === slug || !!errors.slug}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Przetwarzanie..." : "Zmień unikalny odnośnik"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default SlugCard
