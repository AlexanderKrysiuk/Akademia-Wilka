"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lesson, LessonType } from "@prisma/client"
import { X } from "lucide-react"
import EditLessonTitleForm from "./edit-lesson-title-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState, useTransition } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EditLessonSchema } from "@/schemas/lesson"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateLesson } from "@/actions/course/lesson"
import { toast } from "@/components/ui/use-toast"
import ReactQuill from "react-quill"

interface EditLessonFormProps {
    userID: string
    lesson: Lesson | undefined
    onClose: () => void
    onUpdate: () => void
}

const EditLessonForm = ({
    userID,
    lesson,
    onClose,
    onUpdate
} : EditLessonFormProps) => {
    if (!userID || !lesson) return;

    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof EditLessonSchema>>({
        resolver: zodResolver(EditLessonSchema),
        defaultValues: {
            title: lesson.title,
            content: lesson.content || null
        }
    })

    const onSubmit = (values: z.infer<typeof EditLessonSchema>) => {
        startTransition(()=>{
            updateLesson(values, userID, lesson.id)
            .then((data) =>{
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
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            Edytuj lekcję
                        </CardTitle>
                        <div className="hover:text-red-500 transition duration-300">
                            <X
                                className="cursor-pointer"
                                onClick={onClose}
                                />
                        </div>
                    </div>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-[2vh]">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Tytuł</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder={lesson.title}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {lesson.type !== LessonType.Subchapter && (
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Opis</FormLabel>
                                            <FormControl>
                                                <ReactQuill
                                                    value={field.value} // Wartość edytora
                                                    onChange={field.onChange} // Obsługa zmiany wartości
                                                    placeholder="Ten kurs jest o..."
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                        <CardFooter>
                            <div className="flex justify-start space-y-[1vh]">
                                <Button type="submit" disabled={isPending}>
                                    Zaktualizuj Lekcję
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </Form>
                    {/*
                    <EditLessonTitleForm
                        lesson={lesson}
                        userID={userID}
                        onClose={()=>{

                        }}
                        onUpdate={()=>{}}
                        />
                    */}
            </Card>
        </div>
    )
}

export default EditLessonForm