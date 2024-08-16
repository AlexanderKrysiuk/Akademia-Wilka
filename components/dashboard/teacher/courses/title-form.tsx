"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditCourseTitleSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from 'zod'
import { updateCourseTitle } from "@/actions/course/title-update";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SquarePen } from "lucide-react";


interface TitleFormProps {
    course: {
        id:string
        title:string
    }
    userID: string;
    onUpdate: () => void; // Dodaj onUpdate jako props
}

const TitleForm = ({
    course,
    userID,
    onUpdate
}: TitleFormProps) => {
    const [isPending, startTransition] = useTransition()
    const [editTitle, setEditTitle] = useState(false);

    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = (values: z.infer<typeof EditCourseTitleSchema>) => {
        startTransition(()=>{
            updateCourseTitle(values, userID, course.id)
                .then((data) =>{
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    });
                    if (data.success) {
                        setEditTitle(false)
                        onUpdate(); // Wywołaj onUpdate po udanej aktualizacji
                    }
                })
        })
    }

    const form = useForm<z.infer<typeof EditCourseTitleSchema>>({
        resolver: zodResolver(EditCourseTitleSchema),
        defaultValues: {
            title: course.title || "",
        }
    })

    return (
        <Card className="py-[1vh] px-[1vw] w-full">
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Tytuł kursu
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={() => {
                            setEditTitle(prev => !prev);
                        }}
                    >
                        {!editTitle && <SquarePen />}
                        {editTitle ? "Anuluj" : "Edytuj tytuł"}
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {editTitle ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder={course.title}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-start space-y-[1vh]">
                                <Button type="submit" disabled={isPending}>
                                    Zapisz
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <h3>{course.title}</h3>
                )}
            </CardContent>
        </Card>
    );
}
 
export default TitleForm;