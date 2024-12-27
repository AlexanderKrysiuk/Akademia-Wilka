"use client"

import { DeleteVideoIfExist, uploadLessonVideo } from "@/actions/lesson-teacher/lesson-video"
import { FormField } from "@/components/ui/form"
import { UpdateExternalVideoSource } from "@/schemas/lesson"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardBody, CardFooter, CardHeader, Select, SelectItem, Spinner, select } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { FileVideo, PenOff, Replace, VideoOff } from "lucide-react"
import { useRef, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof UpdateExternalVideoSource>

const LessonVideoCard = ({
    courseId,
    chapterId,
    lesson,
    onUpdate
} : {
    courseId:string,
    chapterId:string,
    lesson:Lesson,
    onUpdate: () => void
}) => {
    const sources = [
        //{key: "external", label: "Zewnętrzne"},
        {key: "server", label: "Serwer"}
    ]
    
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    
    const media = lesson.media ? JSON.parse(lesson.media as string) : []
    const initialSource = media.lenght > 0 && media[0].source ? media[0].source : undefined
    
    const [source, setSource] = useState(initialSource)
    const [edit, setEdit] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const { register, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm<FormFields>({
        resolver: zodResolver(UpdateExternalVideoSource)
    })

    //const submitExternalVideo: SubmitHandler<FormFields> = async (data) => {
    //    await DeleteVideoIfExist(courseId,chapterId,lesson.id)
    //    
    //}

    // const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0]
    //     if (!file) return

    //     setIsUploading(true)

    //     const videoElement = document.createElement("video")
    //     videoElement.src = URL.createObjectURL(file)

    //     videoElement.onloadedmetadata = async () => {
    //         const formData = new FormData()
    //         formData.append("video", file)
    //         formData.append("courseId", courseId)
    //         formData.append("chapterId", chapterId)
    //         formData.append("lessonId", lesson.id)
    //         formData.append("duration", videoElement.duration.toString())

    //         try {
    //             await uploadLessonVideo(formData)
    //             toast.success("Film przesłany pomyślnie")
    //             onUpdate()
    //         } catch (error) {
    //             toast.error("Nie udało się przesłać filmu")
    //         } finally {
    //             setIsUploading(false)
    //         }
    //     }
    // }

    const handleVideoUpload = async (file: File) => {
        if (!file.type.startsWith("video/")) {
            toast.error("Proszę przesłać plik wideo.");
            return
        }

        setIsUploading(true)

        const videoElement = document.createElement("video")
        videoElement.src = URL.createObjectURL(file)

        videoElement.onloadedmetadata = async () => {
            const formData = new FormData();
            formData.append("video", file);
            formData.append("courseId", courseId);
            formData.append("chapterId", chapterId);
            formData.append("lessonId", lesson.id);
            formData.append("duration", videoElement.duration.toString());

            try {
                await uploadLessonVideo(formData);
                toast.success("Film przesłany pomyślnie");
                onUpdate();
            } catch (error) {
                toast.error("Nie udało się przesłać filmu");
            } finally {
                setIsUploading(false);
            }
        }
    }

    return (
        <main>
            <CardHeader className="flex items-center justify-between">
                <span>Video</span>
                <Button 
                    color="primary" 
                    size="sm"
                    variant="light"
                    onClick={()=>setEdit(!edit)} 
                    isDisabled={isUploading}
                >
                    {edit ? (
                        <><PenOff size={16}/>Anuluj</>
                    ):(
                        media.length > 0 && media[0].url ? <><Replace size={16}/>Zmień video</> : <><FileVideo size={16}/> Dodaj video</>
                    )}
                </Button>
            </CardHeader>
            <CardBody>
                {edit ? (
                    <div className="space-y-4">
                        <Select 
                            label="Źródło filmu" 
                            placeholder="Wybierz źródło filmu"
                            variant="bordered"
                            //selectedKeys={source ? [source] : undefined}
                            selectedKeys={source}
                            onChange={(event) => setSource(event.target.value)}                          >
                            {sources.map((source) => (
                                <SelectItem key={source.key}>{source.label}</SelectItem>
                            ))}
                        </Select>
                        {source === "server" && (
                            <div>
                                <div
                                    className={`w-full h-auto aspect-video border-2 border-dashed border-primary flex justify-center items-center flex-col ${
                                        isUploading ? "cursor-not-allowed pointer-events-none opacity-50" : "cursor-pointer"
                                    }`}                                    
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (isUploading) {
                                            toast.error("Przesyłanie pliku jest w toku, poczekaj na zakończenie.");
                                            return;
                                        }
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) handleVideoUpload(file);
                                    }}
                                    onClick={() => {
                                        if (!isUploading) {
                                            fileInputRef.current?.click();
                                        } else {
                                            toast.error("Przesyłanie pliku jest w toku, poczekaj na zakończenie.");
                                        }
                                    }}                                
                                >
                                    {isUploading ? (
                                        <>
                                            <Spinner size="lg" color="primary" />
                                            <span className="text-sm text-primary mt-2">Przesyłanie pliku...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileVideo className="w-10 h-auto text-primary mb-2" />
                                            <span className="text-sm text-primary">Przeciągnij i upuść plik wideo lub kliknij, aby wybrać</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/mp4"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleVideoUpload(file);
                                    }}                                />
                            </div>
                        )}
                    </div>
                ) : (
                    media.length > 0 && media[0].url ? (
                        <video controls>
                            <source src={media[0].url} type="video/mp4"/>
                        </video>
                    ) : (
                        <div className="w-full h-auto aspect-video bg-primary/10 flex justify-center items-center flex-col">
                            

                            <VideoOff className="w-10 h-auto"/>
                            Brak Video
                            
                        </div>
                    )
                )}
            </CardBody>
            {/*
            <CardFooter>
                <Button color="primary" onClick={()=>fileInputRef.current?.click()} isDisabled={isUploading}>
                    {media.length > 0 && media[0].url ? "Zmień video" : "Dodaj video"}
                </Button>

            </CardFooter>
            */}
        </main>
    )
}
export default LessonVideoCard