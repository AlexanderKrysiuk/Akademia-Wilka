"use client";

import { getLevels, updateCourseLevel } from "@/actions/course/level";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { EditCourseLevelSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Level } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

interface LevelFormProps {
    initialData: {
        id: string;
        levelId: string | null;
    };
    userID: string;
    onUpdate: () => void;
}

const CategoryForm = ({
    initialData,
    userID,
    onUpdate
}: LevelFormProps) => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof EditCourseLevelSchema>>({
        resolver: zodResolver(EditCourseLevelSchema),
        defaultValues: {
            levelId: initialData.levelId || ""
        }
    });

    useEffect(() => {
        const fetchLevels = async () => {
            const fetchedLevels = await getLevels();
            if (fetchedLevels) {
                setLevels(fetchedLevels);
                if (initialData.levelId) {
                    form.setValue("levelId", initialData.levelId); // Ustawienie wartości domyślnej po załadowaniu danych
                }
                setLoading(false);
            }
        }
        fetchLevels();
    }, [initialData.levelId, form]);

    const selectedLevel = levels.find(level => level.id === form.watch('levelId'));

    const onSubmit = (values: z.infer<typeof EditCourseLevelSchema>) => {
        startTransition(()=>{
            updateCourseLevel(values, userID, initialData.id)
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
                    name="levelId"
                    render={({ field }) => (
                        <FormItem>
                            <Select 
                                onValueChange={field.onChange} 
                                value={field.value || ""} // Użycie `value` zamiast `defaultValue`
                                disabled={loading || isPending}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wybierz poziom">
                                            {selectedLevel ? selectedLevel.name : "Wybierz poziom"}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {levels.map(level => (
                                        <SelectItem key={level.id} value={level.id}>
                                            {level.name}
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
