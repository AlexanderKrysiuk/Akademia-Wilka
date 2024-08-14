"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditCoursePriceSchema, EditCourseTitleSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from 'zod'
import { updateCoursePrice } from "@/actions/course/price";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/format";


interface PriceFormProps {
    initialData: {
        id:string
        price:number|null
    }
    userID: string;
    onUpdate: () => void; // Dodaj onUpdate jako props
}

const PriceForm = ({
    initialData,
    userID,
    onUpdate
}: PriceFormProps) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = (values: z.infer<typeof EditCoursePriceSchema>) => {
        startTransition(()=>{
            updateCoursePrice(values, userID, initialData.id)
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

    const form = useForm<z.infer<typeof EditCoursePriceSchema>>({
        resolver: zodResolver(EditCoursePriceSchema),
        defaultValues: {
            price: initialData.price ?? undefined,
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                <FormField
                    control={form.control}
                    name="price"
                    render={({field}) =>(
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="number"
                                    step={0.01}
                                    min={0}
                                    disabled={isPending}
                                    placeholder={initialData.price !== null ? `${initialData.price}` : "Podaj cenę kursu"}
                                    {...field}
                                    value={field.value ?? ""}
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
 
export default PriceForm;