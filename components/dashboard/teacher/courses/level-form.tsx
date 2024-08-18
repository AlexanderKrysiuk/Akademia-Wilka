"use client";

import { getLevelByID, getLevels, updateCourseLevel } from "@/actions/course/level";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { EditCourseLevelSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Level } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { SquarePen } from "lucide-react";

interface LevelFormProps {
    course: {
        id: string;
        levelId: string | null;
    };
    userID: string;
    onUpdate: () => void;
}

const CategoryForm = ({
    course,
    userID,
    onUpdate
}: LevelFormProps) => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [level, setLevel] = useState<Level>()
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false)
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof EditCourseLevelSchema>>({
        resolver: zodResolver(EditCourseLevelSchema),
        defaultValues: {
            levelId: course.levelId || ""
        }
    });

    useEffect(() => {
        const fetchLevels = async () => {
            const fetchedLevels = await getLevels();
            if (fetchedLevels) {
                setLevels(fetchedLevels);
                if (course.levelId) {
                    form.setValue("levelId", course.levelId); // Ustawienie wartości domyślnej po załadowaniu danych
                }
                setLoading(false);
            }
            if (course.levelId) {
                const fetchedLevel = await getLevelByID(course.levelId)
                if (fetchedLevel) {
                    setLevel(fetchedLevel)
                }
                return 
            }
        }
        fetchLevels();
    }, [course.levelId, form]);

    const selectedLevel = levels.find(level => level.id === form.watch('levelId'));

    const onSubmit = (values: z.infer<typeof EditCourseLevelSchema>) => {
        startTransition(()=>{
            updateCourseLevel(values, userID, course.id)
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
        <Card>
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Poziom kursu
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={() => {
                            setEdit(prev => !prev);
                        }}
                    >
                        {!edit && <SquarePen />}
                        {edit ? "Anuluj" : "Edytuj poziom"}
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {edit ? (
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
                ) : (
                    <div>
                        {level ? level.name : "Brak poziomu"}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default CategoryForm;
