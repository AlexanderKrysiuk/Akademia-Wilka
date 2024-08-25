"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lesson, LessonType, VideoSource } from "@prisma/client"
import { X } from "lucide-react"
import EditLessonTitleForm from "./edit-lesson-title-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useEffect, useState, useTransition } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EditLessonSchema } from "@/schemas/lesson"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateLesson } from "@/actions/course/lesson"
import { toast } from "@/components/ui/use-toast"
import ReactQuill from "react-quill"
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { ExtendedLesson } from "@/types/lesson"
import VideoPlayer from "@/utils/video"

interface EditLessonFormProps {
    userID: string
    lesson: ExtendedLesson | undefined
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
    const [videoSource, setVideoSource] = useState<VideoSource>()
    const [file, setFile] = useState<File>()
    const [videoUrl, setVideoUrl] = useState<string>()

    useEffect(() => {
        if (lesson.video?.source) {
            setVideoSource(lesson.video.source)
        }
        if (lesson.video?.url) {
            setVideoUrl(lesson.video.url)
        }
    },[lesson.video?.source])
    
    const form = useForm<z.infer<typeof EditLessonSchema>>({
        resolver: zodResolver(EditLessonSchema),
        defaultValues: {
            title: lesson.title,
            content: lesson.content || null,
            video: lesson.video ? {
                url: lesson.video.url || undefined,
                name: lesson.video.name || undefined,
                source: lesson.video.source
            } : null,
        }
    })

    
    const onSubmit = (values: z.infer<typeof EditLessonSchema>) => {
        console.log("VALUES: ", values)
        startTransition(()=>{
            updateLesson(values, userID, lesson.id, file)
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
        {/* 
        */}
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
                            {lesson.type === LessonType.Video && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="video.source"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>Źródło filmu</FormLabel>
                                                <Select
                                                    onValueChange={(value)=>{
                                                        field.onChange(value)
                                                        setVideoSource(value as VideoSource)
                                                    }}
                                                    defaultValue={lesson.video?.source ?? undefined}
                                                    >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Wybierz źródło filmu"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={VideoSource.internal}>Serwer</SelectItem>
                                                        <SelectItem value={VideoSource.youtube}>YouTube</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {videoSource === VideoSource.youtube && (
                                        <FormField
                                            control={form.control}
                                            name="video.url"
                                            render={({field})=>(
                                                <FormItem>
                                                    <FormLabel>Link do filmu</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="url"
                                                            disabled={isPending}
                                                            placeholder={lesson.video?.url}
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                setVideoUrl(e.target.value); // Update state on change
                                                              }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    {videoSource === VideoSource.internal && (
                                        <Input
                                            id="video"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    )}
                                    {videoUrl && videoSource && (
                                        <VideoPlayer source={videoSource} url={videoUrl}/>
                                    )}
                                </>
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