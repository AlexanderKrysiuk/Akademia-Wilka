"use client"

import { UpdateCourseDescription } from "@/actions/course-teacher/description"
import { EditCourseDescriptionSchema } from "@/schemas/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof EditCourseDescriptionSchema>

const DescriptionCard = ({
    courseId,
    description
} : {
    courseId: string,
    description: string | null
}) => {
    const router = useRouter()
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: { description: description ?? undefined } ,
        resolver: zodResolver(EditCourseDescriptionSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (fields) => {
        startTransition(()=>{
            UpdateCourseDescription(fields, courseId)
                .then(()=>{
                    toast.success("Opis kursu został zaktualizowany")
                    router.refresh()
                })
                .catch((error)=>{
                    setError("description", {message: error.message})
                    toast.error(error.message)
                })
        })
    }

    return ( 
        <main></main>
     );
}
 
export default DescriptionCard;