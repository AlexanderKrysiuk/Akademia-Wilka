"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { EditCourseDescriptionSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from 'zod'
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import { updateCourseDescription } from "@/actions/course/description-update";
import ReactQuill from 'react-quill';

interface DescriptionFormProps {
    initialData: {
        id:string
        description:string | null
    }
    userID: string;
    onUpdate: () => void; // Dodaj onUpdate jako props
}

const DescriptionForm = ({
    initialData,
    userID,
    onUpdate
}: DescriptionFormProps) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = (values: z.infer<typeof EditCourseDescriptionSchema>) => {
        startTransition(()=>{
            updateCourseDescription(values, userID, initialData.id)
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

    const form = useForm<z.infer<typeof EditCourseDescriptionSchema>>({
        resolver: zodResolver(EditCourseDescriptionSchema),
        defaultValues: {
            description: initialData.description || "", // Użyj opisu jako domyślnej wartości
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) =>(
                        <FormItem>
                            <FormControl>
                                {/*
                                <Textarea
                                    disabled={isPending}
                                    placeholder="Ten kurs jest o..."
                                    {...field}
                                />
                                */}
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
    );
}
 
export default DescriptionForm;