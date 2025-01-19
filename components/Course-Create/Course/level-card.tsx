"use client"

import { UpdateCourseLevel } from "@/actions/course-teacher/level"
import { LevelNames } from "@/lib/enums"
import { Button, Card, CardBody, CardFooter, Select, SelectItem } from "@heroui/react"
import { Level } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"

type FormFields = {
    level: Level,
    courseId: string,
    userId: string
}

const LevelCard = ({
    courseId,
    userId,
    level,
} : {
    courseId: string,
    userId: string,
    level: Level | null,
}) => {
    const router = useRouter()
    const { control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
        defaultValues: { 
            level: level ?? undefined ,
            userId, 
            courseId }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const result = await UpdateCourseLevel(data.level, data.userId, data.courseId)
            toast.success(result)
            router.refresh()
        } catch(error) {
            console.error("Error updating course level:", error);  // Logowanie błędu
            const errorMessage = error instanceof Error ? error.message : "Nie udało się zaktualizować poziomu"
            setError("root", {message: errorMessage})
            toast.error(errorMessage)
        }
    }

    return (
        <Card>                
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                            <Select
                            label="Poziom"
                            labelPlacement="outside"
                            isRequired
                            variant="bordered"
                            isInvalid={errors.root ? true : false}
                            errorMessage={errors.root?.message}
                            isDisabled={isSubmitting}
                            placeholder={field.value ? LevelNames[field.value] : "Wybierz poziom"}
                            onChange={(event)=>{
                                const selectedCategory = event.target.value as Level;
                                field.onChange(selectedCategory)
                            }}
                            >   
                                {Object.values(Level).map((level) => (
                                    <SelectItem key={level} value={level}>
                                        {LevelNames[level]}
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
                        isDisabled={!watch("level") || watch("level") === level || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Przetwarzanie..." : "Zmień poziom"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
export default LevelCard