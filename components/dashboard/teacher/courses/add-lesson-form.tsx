"use client"

import { createLesson } from "@/actions/course/lesson"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { CreateLessonSchema } from "@/schemas/lesson"
import { zodResolver } from "@hookform/resolvers/zod"
import { LessonType } from "@prisma/client"
import { Loader2, SquarePlus, X } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'

interface AddLessonFormProps {
    chapterID: string
    userID: string
    LessonType: LessonType
    onUpdate: () => void
    onClose: () => void
}

const AddLessonForm = ({
    chapterID,
    userID,
    LessonType,
    onUpdate,
    onClose,
} : AddLessonFormProps) => {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof CreateLessonSchema>>({
        resolver: zodResolver(CreateLessonSchema)
    })

    const onSubmit = (values: z.infer<typeof CreateLessonSchema>) => {
        startTransition(()=>{
            createLesson(values, userID, chapterID, LessonType)
                .then((data) => {
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    });
                    if (data.success) {
                        onUpdate()
                    }
                })
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <Card className="bg-background px-[1vw] py-[1vh]">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            Dodaj {LessonType === "Subchapter" ? "nowy podrozdział" : "nową lekcję" }
                        </CardTitle>
                        <div className="transition duration-500 hover:text-red-500">
                            <X onClick={onClose} className="cursor-pointer"/>
                        </div>
                    </div>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[1vh]">
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Tytuł {LessonType === "Subchapter" ? "podrozdziału" : "lekcji" }</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder="Aerodynamika"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <div className="flex flex-col items-center space-y-[1vh] w-full">
                                <div className="justify-start w-full">
                                    <Button className="gap-x-[1vw]">
                                        <SquarePlus/> Dodaj {LessonType === "Subchapter" ? "podrozdział" : "lekcję" }
                                    </Button>
                                </div>
                                {isPending && (
                                    <div className="flex items-center justify-center mt-2">
                                        <Loader2 className="animate-spin" />
                                        <span> Dodawanie...</span>
                                    </div>
                                )}
                            </div>
                        </CardFooter>
                    </form>
                </Form>                   
            </Card>
        </div>
    );
}
 
export default AddLessonForm;