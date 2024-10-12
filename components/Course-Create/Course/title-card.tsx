"use client"

import { UpdateCourseTitle } from "@/actions/course-teacher/title";
import { useCurrentUser } from "@/hooks/user";
import { EditCourseTitleSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "@nextui-org/react";
import { UserRole } from "@prisma/client";
import { Pen, PenOff } from "lucide-react";
import { startTransition, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";


type FormFields = z.infer<typeof EditCourseTitleSchema>

const TitleCard = ({
    courseId,
    title,
    onUpdate
} : {
    courseId:string
    title:string
    onUpdate: () => void
}
) => {   
    const user = useCurrentUser()

    if (!user || !user.role.includes(UserRole.Teacher || UserRole.Teacher)) return

    const [edit, setEdit] = useState(false)
    const { register, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: {title}, 
        resolver: zodResolver(EditCourseTitleSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(()=>{
            UpdateCourseTitle(data, user.id, courseId)
                .then(()=>{
                    toast.success("Tytuł kursu został zmieniony")
                    onUpdate()
                    setEdit(false)
                })
                .catch((error)=>{
                    setError("title", {message: error.message})
                    toast.error(error.message)
                })
        })
    }


    return ( 
        <main>
            <Card>
                <CardHeader className="flex justify-between">
                    <h6>Tytuł</h6>
                    <Button variant="light" color="primary" onClick={() => setEdit(!edit)} startContent={edit ? <PenOff size={16}/> : <Pen size={16}/>}>
                        {edit ? "Anuluj" : "Edytuj"}
                    </Button>
                </CardHeader>
                {edit ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardBody>
                            <Input {...register("title")}
                                label="Tytuł"
                                labelPlacement="outside"
                                type="text"
                                placeholder="Rocket Science"
                                isRequired
                                isClearable
                                disabled={isSubmitting}
                                variant="bordered"
                                isInvalid={errors.title ? true : false}
                                errorMessage={errors.title?.message}
                            />
                        </CardBody>
                        <CardFooter>
                            <Button type="submit" color="primary" disabled={isSubmitting} isLoading={isSubmitting}>
                                {isSubmitting ? "Przetwarzanie..." : "Zmień tytuł"}
                            </Button>
                        </CardFooter>
                    </form>
                ) : (
                    <CardBody>
                        {title}
                    </CardBody>
                )}
                    
            </Card>
        </main>
     );
}
 
export default TitleCard;