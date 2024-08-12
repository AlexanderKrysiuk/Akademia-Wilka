"use client";

import { getCategories } from "@/actions/course/category";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { EditCourseCategorySchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

interface CategoryFormProps {
    initialData: {
        id:string
        categoryId:string|null
    }
    userID: string;
    onUpdate: () => void
}

const CategoryForm = ({
    initialData,
    userID,
    onUpdate
}: CategoryFormProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            if (fetchedCategories) {
                setCategories(fetchedCategories);
                setLoading(false);
            }
        }
        fetchCategories();
    },[]);
    
    const form = useForm<z.infer<typeof EditCourseCategorySchema>>({
        resolver: zodResolver(EditCourseCategorySchema),
        defaultValues: {
            categoryId: initialData.categoryId || ""
        }
    });

    // Find the currently selected category to display its name in the SelectValue
    const selectedCategory = categories.find(category => category.id === form.watch('categoryId'));

    const onSubmit = (data: z.infer<typeof EditCourseCategorySchema>) => {
        console.log("Form data:", data);
        // You can now pass `data` to your `onUpdate` function or do other actions
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value} 
                                    disabled={loading}
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
                    <button type="submit" className="btn btn-primary">
                        Zapisz
                    </button>
                </form>
            </Form>
        </div>
    );
}

export default CategoryForm;
