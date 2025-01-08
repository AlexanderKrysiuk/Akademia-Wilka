"use client"

import { UpdateCourseCategory } from "@/actions/course-teacher/category"
import { CategoryNames } from "@/lib/enums"
import { Button, Card, CardBody, CardFooter, CardHeader, Select, SelectItem } from "@nextui-org/react"
import { Category } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = {
    category: Category,
    courseId: string,
    userId: string
}

const CategoryCard = ({
    courseId,
    userId,
    category,
} : {
    courseId: string,
    userId: string,
    category: Category | null,
}) => {
    const router = useRouter()
    const { control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
        defaultValues: { 
            category: category ?? undefined ,
            userId, 
            courseId }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const result = await UpdateCourseCategory(data.category, data.userId, data.courseId)
            toast.success(result)
            router.refresh()
        } catch(error) {
            console.error("Error updating course category:", error);  // Logowanie błędu
            const errorMessage = error instanceof Error ? error.message : "Nie udało się zaktualizować kategorii"
            setError("root", {message: errorMessage})
            toast.error(errorMessage)
        }
        {/*
        startTransition(async ()=>{
            await UpdateCategory(courseId, data.category.id)
                .then(()=>{
                    toast.success("Kategoria została zmieniona pomyślnie")
                    onUpdate()
                })
                .catch((error)=>{
                    setError("root", {message: error.message})
                    toast.error(error.message)
                })
        })
        */}
    }

    return (
        <Card>
            {/*
            <CardHeader className="flex justify-between">
                <h6>Wybierz Kategorię</h6>
                
                <Button 
                    variant="light" 
                    color="primary" 
                    onClick={()=> {
                        setEdit(!edit)
                        setSelectedCategoryId(categoryId)
                    }} 
                    startContent={edit ? <PenOff size={16}/> : <Pen size={16}/>}>
                    {edit ? "Anuluj" : "Edytuj"}
                </Button>
            </CardHeader>
                */} 
                
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select
                            label="Kategoria"
                            labelPlacement="outside"
                            isRequired
                            variant="bordered"
                            isInvalid={errors.root ? true : false}
                            errorMessage={errors.root?.message}
                            isDisabled={isSubmitting}
                            placeholder={field.value ? CategoryNames[field.value] : "Wybierz kategorię"}
                            onChange={(event)=>{
                                const selectedCategory = event.target.value as Category;
                                field.onChange(selectedCategory)
                            }}
                            >   
                                {Object.values(Category).map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {CategoryNames[category]}
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
                        //isDisabled={!getValues("category") || getValues("category")?.id === categoryId} // Sprawdzenie czy kategoria jest inna niż domyślna
                        isDisabled={!watch("category") || watch("category") === category || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Przetwarzanie..." : "Zmień kategorię"}
                    </Button>
                </CardFooter>
            </form>
            {/* 
            {edit ? (
                <main>

                    <CardBody>
                        <Select
                            label="Kategoria"
                            labelPlacement="outside"
                            isRequired
                            variant="bordered"
                            placeholder={selectedCategory ? selectedCategory.name : "Wybierz kategorię"}
                            selectedKeys={selectedCategoryId}
                            onChange={(e)=>{setSelectedCategoryId(e.target.value)}}
                            >
                            {categories.map((category) => (
                                <SelectItem key={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </CardBody>
                    <CardFooter>
                            <Button>

                            </Button>
                    </CardFooter>
                </main>
            ) : (
                <CardBody>
                    {selectedCategory ? (
                        selectedCategory.name
                    ) : (
                        "Brak Kategorii"
                    )}
                </CardBody>
            )}
            Wybrany przedmiot: {selectedCategoryId}
                        */}

        </Card>
    )
}
export default CategoryCard