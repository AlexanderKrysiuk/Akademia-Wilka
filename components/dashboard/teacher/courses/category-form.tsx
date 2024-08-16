"use client";

import { getCategories, getCategoryByID, updateCourseCategory } from "@/actions/course/category";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { EditCourseCategorySchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { SquarePen } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

interface CategoryFormProps {
    course: {
        id: string;
        categoryId: string | null;
    };
    userID: string;
    onUpdate: () => void;
}

const CategoryForm = ({
    course,
    userID,
    onUpdate
}: CategoryFormProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category>();
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false)
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof EditCourseCategorySchema>>({
        resolver: zodResolver(EditCourseCategorySchema),
        defaultValues: {
            categoryId: course.categoryId || ""
        }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            if (fetchedCategories) {
                setCategories(fetchedCategories);
                if (course.categoryId) {
                    form.setValue("categoryId", course.categoryId); // Ustawienie wartości domyślnej po załadowaniu danych
                }
            }
            if (course.categoryId) {
                const fetchedCategory = await getCategoryByID(course.categoryId)
                if (fetchedCategory) {
                    setCategory(fetchedCategory)
                } else {
                    return
                }
            }
            setLoading(false);
        }
        fetchCategories();
    }, [course.categoryId, form]);

    const selectedCategory = categories.find(category => category.id === form.watch('categoryId'));

    const onSubmit = (values: z.infer<typeof EditCourseCategorySchema>) => {
        startTransition(()=>{
            updateCourseCategory(values, userID, course.id)
                .then((data)=>{
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    })
                    if (data.success) {
                        setEdit(false)
                        onUpdate();
                    }
                })
        })
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Kategoria kursu
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={() => {
                            setEdit(prev => !prev);
                        }}
                    >
                        {!edit && <SquarePen />}
                        {edit ? "Anuluj" : "Edytuj kategorię"}
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {edit ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value || ""} // Użycie `value` zamiast `defaultValue`
                                            disabled={loading || isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Wybierz kategorię">
                                                        {selectedCategory ? selectedCategory.name : "Wybierz kategorię"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isPending}>
                                Zapisz
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <div>
                        {category ? category.name : "Brak kategorii"}
                    </div>    
                )}
            </CardContent>
        </Card>
    );
}

export default CategoryForm;
