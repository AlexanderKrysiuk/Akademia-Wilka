"use client"

import { UpdateCourseSubject } from "@/actions/course-teacher/subject"
import { SubjectNames } from "@/lib/enums"
import { Button, Card, CardBody, CardFooter, Select, SelectItem } from "@nextui-org/react"
import { Subject } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"

type FormFields = {
    subject: Subject,
    courseId: string,
    userId: string
}

const SubjectCard = ({
    courseId,
    userId,
    subject,
    
} : {
    courseId: string,
    userId: string,
    subject: Subject | null,
}) => {
    const router = useRouter()
    const { control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
        defaultValues: { 
            subject: subject ?? undefined ,
            userId, 
            courseId }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const result = await UpdateCourseSubject(data.subject, data.userId, data.courseId)
            toast.success(result)
            router.refresh()
        } catch(error) {
            console.error("Error updating course subject:", error);  // Logowanie błędu
            const errorMessage = error instanceof Error ? error.message : "Nie udało się zaktualizować przedmiotu"
            setError("root", {message: errorMessage})
            toast.error(errorMessage)
        }
    }

    return (
        <Card>                
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <Select
                            label="Przedmiot"
                            labelPlacement="outside"
                            isRequired
                            variant="bordered"
                            isInvalid={errors.root ? true : false}
                            errorMessage={errors.root?.message}
                            isDisabled={isSubmitting}
                            placeholder={field.value ? SubjectNames[field.value] : "Wybierz przedmiot"}
                            onChange={(event)=>{
                                const selectedSubject = event.target.value as Subject;
                                field.onChange(selectedSubject)
                            }}
                            >   
                                {Object.values(Subject).map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                        {SubjectNames[subject]}
                                    </SelectItem>
                                ))}
                        </Select>
                        )}
                    />
                </CardBody>
                <CardFooter>
                    <Button 
                        type="submit" 
                        color="primary"
                        isDisabled={!watch("subject") || watch("subject") === subject || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Przetwarzanie..." : "Zmień przedmiot"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
export default SubjectCard