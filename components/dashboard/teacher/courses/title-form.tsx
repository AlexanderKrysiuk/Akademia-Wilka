"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditCourseTitleSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from 'zod'
import { updateCourseTitle } from "@/actions/course/title-update";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"


interface TitleFormProps {
    initialData: {
        id:string
        title:string
    }
    userID: string;
    onUpdate: () => void; // Dodaj onUpdate jako props
}

const TitleForm = ({
    initialData,
    userID,
    onUpdate
}: TitleFormProps) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = (values: z.infer<typeof EditCourseTitleSchema>) => {
        startTransition(()=>{
            updateCourseTitle(values, userID, initialData.id)
                .then((data) =>{
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    });
                    if (data.success) {
                        onUpdate(); // Wywołaj onUpdate po udanej aktualizacji
                    }
                })
        })
    }

    const form = useForm<z.infer<typeof EditCourseTitleSchema>>({
        resolver: zodResolver(EditCourseTitleSchema),
        defaultValues: {
            title: initialData.title || "",
        }
    })

    return (
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
                                    placeholder={initialData.title}
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
    );
}
 
export default TitleForm;