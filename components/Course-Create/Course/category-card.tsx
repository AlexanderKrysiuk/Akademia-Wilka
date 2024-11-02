"use client"

import { GetCategories, UpdateCategory } from "@/actions/course-teacher/category"
import { useCurrentUser } from "@/hooks/user"
import { CategorySchema } from "@/schemas/course"
import { Button, Card, CardBody, CardFooter, CardHeader, Select, SelectItem } from "@nextui-org/react"
import { Category, UserRole } from "@prisma/client"
import { error } from "console"
import { Pen, PenOff } from "lucide-react"
import { startTransition, useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = {
    category: Category
}

const CategoryCard = ({
    courseId,
    categoryId,
    categories,
    onUpdate
} : {
    courseId: string,
    categoryId: string | null,
    categories: Category[],
    onUpdate: () => void
}) => {

    const [edit, setEdit] = useState(false)
    const { control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
        defaultValues: { category: categories.find(cat => cat.id === categoryId)}
    });
    //const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(categoryId)

// Znajdujemy nazwę kategorii na podstawie selectedCategoryId
    const selectedCategory = categoryId 
        ? categories.find(cat => cat.id === categoryId) 
        : undefined

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
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
                            placeholder={field.value ? field.value.name : (categories.find(cat => cat.id === categoryId)?.name || "Wybierz Kategorię")}
                            onChange={(event)=>{
                                const selectedCategory = categories.find(cat => cat.id === event.target.value)
                                field.onChange(selectedCategory)
                            }}
                            >
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
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
                        isDisabled={!watch("category") || watch("category.id") === categoryId || isSubmitting}
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