"use client"

import { UpdateLevel } from "@/actions/course-teacher/level"
import { Button, Card, CardBody, CardFooter, Select, SelectItem } from "@nextui-org/react"
import { Level } from "@prisma/client"
import { startTransition } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"

type FormFields = {
    level: Level
}

const LevelCard = ({
    courseId,
    levelId,
    levels,
    onUpdate
} : {
    courseId: string,
    levelId: string | null,
    levels: Level[],
    onUpdate: () => void
}) => {
    const { control, handleSubmit, watch, setError, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: { level: levels.find(lvl => lvl.id === levelId)}
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async () => {
            await UpdateLevel(courseId, data.level.id)
            .then(()=>{
                toast.success("Poziom został zmieniony pomyślnie")
                onUpdate()
            })
            .catch((error)=>{
                setError("root", {message: error.message})
                toast.error(error.message)
            })
        })
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
                                placeholder={field.value ? field.value.name : (levels.find(lvl => lvl.id === levelId)?.name || "Wybierz poziom")}
                                onChange={(event)=>{
                                    const selectedLevel = levels.find(lvl => lvl.id === event.target.value)
                                    field.onChange(selectedLevel)
                                }}
                            >
                                {levels.map((level)=>(
                                    <SelectItem key={level.id} value={level.id}>
                                        {level.name}
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
                        isDisabled={!watch("level") || watch("level.id") === levelId || isSubmitting}
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