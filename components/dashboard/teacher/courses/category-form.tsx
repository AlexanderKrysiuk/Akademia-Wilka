"use client";

import { getCategories, updateCourseCategory } from "@/actions/course/category";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { EditCourseCategorySchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

interface CategoryFormProps {
    initialData: {
        id: string;
        categoryId: string | null;
    };
    userID: string;
    onUpdate: () => void;
}

const CategoryForm = ({
    initialData,
    userID,
    onUpdate
}: CategoryFormProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof EditCourseCategorySchema>>({
        resolver: zodResolver(EditCourseCategorySchema),
        defaultValues: {
            categoryId: initialData.categoryId || ""
        }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            if (fetchedCategories) {
                setCategories(fetchedCategories);
                if (initialData.categoryId) {
                    form.setValue("categoryId", initialData.categoryId); // Ustawienie wartości domyślnej po załadowaniu danych
                }
                setLoading(false);
            }
        }
        fetchCategories();
    }, [initialData.categoryId, form]);

    const selectedCategory = categories.find(category => category.id === form.watch('categoryId'));

    const onSubmit = (values: z.infer<typeof EditCourseCategorySchema>) => {
        startTransition(()=>{
            updateCourseCategory(values, userID, initialData.id)
                .then((data)=>{
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    })
                    if (data.success) {
                        onUpdate();
                    }
                })
        })
    };

    return (
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
    );
}

export default CategoryForm;
