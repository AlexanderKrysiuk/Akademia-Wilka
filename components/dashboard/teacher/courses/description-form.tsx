"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { EditCourseDescriptionSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from 'zod'
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import { updateCourseDescription } from "@/actions/course/description-update";
import ReactQuill from 'react-quill';
import { SquarePen } from "lucide-react";

interface DescriptionFormProps {
    course: {
        id:string
        description:string | null
    }
    userID: string;
    onUpdate: () => void; // Dodaj onUpdate jako props
}

const DescriptionForm = ({
    course,
    userID,
    onUpdate
}: DescriptionFormProps) => {
    const [isPending, startTransition] = useTransition()
    const [edit, setEdit] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = (values: z.infer<typeof EditCourseDescriptionSchema>) => {
        startTransition(()=>{
            updateCourseDescription(values, userID, course.id)
                .then((data) =>{
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    });
                    if (data.success) {
                        setEdit(false)
                        onUpdate(); // Wywołaj onUpdate po udanej aktualizacji
                    }
                })
        })
    }

    const form = useForm<z.infer<typeof EditCourseDescriptionSchema>>({
        resolver: zodResolver(EditCourseDescriptionSchema),
        defaultValues: {
            description: course.description || "", // Użyj opisu jako domyślnej wartości
        }
    })

    return (
        <Card className="py-[1vh] px-[1vw] w-full">
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Opis kursu
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={()=>{
                            setEdit(prev => !prev)
                        }}
                    >
                        {!edit && <SquarePen />}
                        {edit ? "Anuluj" : "Edytuj opis"}
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {edit ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormControl>
                                            <ReactQuill
                                                value={field.value || ""} // Wartość edytora
                                                onChange={field.onChange} // Obsługa zmiany wartości
                                                placeholder="Ten kurs jest o..."
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
                    <div dangerouslySetInnerHTML={{ __html: course.description || "Brak opisu..." }} />
                )}
            </CardContent>
        </Card>
    );
}
 
export default DescriptionForm;