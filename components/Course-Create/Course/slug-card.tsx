"use client"

import { UpdateCourseSlug } from "@/actions/course-teacher/slug"
import { useCurrentUser } from "@/hooks/user"
import { EditCourseSlugSchema } from "@/schemas/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "@nextui-org/react"
import { UserRole } from "@prisma/client"
import { Pen, PenOff } from "lucide-react"
import { startTransition, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof EditCourseSlugSchema>

const SlugCard = ({
    courseId,
    slug,
    onUpdate
} : {
    courseId:string
    slug:string | null
    onUpdate: () => void
}) => {
    const user = useCurrentUser()
    if (!user || !user.role.includes(UserRole.Teacher || UserRole.Admin)) return

    const [edit, setEdit] = useState(false)
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: slug? {slug} : undefined,
        resolver: zodResolver(EditCourseSlugSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(()=>{
            UpdateCourseSlug(data, user.id, courseId)
                .then(()=>{
                    toast.success("Odnośnik został zmieniony pomyślnie")
                    onUpdate()
                    setEdit(false)
                })
                .catch((error)=>{
                    setError("slug", {message: error.message})
                    toast.error(error.message)
                })
        })
    }
    return (
        <main>
            <Card>
                <CardHeader className="flex justify-between">
                    <h6>Unikalny odnośnik</h6>
                    <Button variant="light" color="primary" onClick={()=>setEdit(!edit)} startContent={edit ? <PenOff size={16}/> : <Pen size={16}/>}>
                        {edit ? "Anuluj" : "Edytuj"}
                    </Button>
                </CardHeader>
                {edit ? (
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
                                isInvalid={errors.slug ? true : false}
                                errorMessage={errors.slug?.message}
                                description={`Unikalny odnośnik będzie wyglądał następująco: https://www.akademiawilka.pl/kurs/${watch("slug") || "rocket-science"}/`}
                                />
                        </CardBody>
                        <CardFooter>
                            <Button type="submit" color="primary" disabled={isSubmitting} isLoading={isSubmitting}>
                                {isSubmitting ? "Przetwarzanie..." : "Zmień unikalny odnośnik"}
                            </Button>
                        </CardFooter>
                    </form>
                ) : (
                    <CardBody>
                        {slug || "Brak odnośnika"}
                    </CardBody>
                )}
            </Card>
        </main>
    )
}

export default SlugCard