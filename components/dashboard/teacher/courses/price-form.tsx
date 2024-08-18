"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
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
import { SquarePen } from "lucide-react";


interface PriceFormProps {
    course: {
        id:string
        price:number|null
    }
    userID: string;
    onUpdate: () => void; // Dodaj onUpdate jako props
}

export const PriceForm = ({
    course,
    userID,
    onUpdate
}: PriceFormProps) => {
    const [isPending, startTransition] = useTransition()
    const [edit, setEdit] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = (values: z.infer<typeof EditCoursePriceSchema>) => {
        startTransition(()=>{
            updateCoursePrice(values, userID, course.id)
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

    const form = useForm<z.infer<typeof EditCoursePriceSchema>>({
        resolver: zodResolver(EditCoursePriceSchema),
        defaultValues: {
            price: course.price ?? undefined,
        }
    })

    return (
        <Card>
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Cena kursu
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={() => {
                            setEdit(prev => !prev);
                        }}
                    >
                        {!edit && <SquarePen />}
                        {edit ? "Anuluj" : "Edytuj cenę"}
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {edit ? (
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
                                                placeholder={course.price !== null ? `${course.price}` : "Podaj cenę kursu"}
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
                ) : (
                    <div>
                        {course.price ? formatPrice(course.price) : "Kurs bezpłatny"}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
 
export default PriceForm;