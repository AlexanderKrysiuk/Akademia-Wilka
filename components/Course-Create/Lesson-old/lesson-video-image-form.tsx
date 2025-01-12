"use client"

import "react-image-crop/dist/ReactCrop.css";
import { UploadLessonVideoImage } from "@/actions/lesson-teacher/lesson-video-image"
import { CardBody, CardHeader, useDisclosure, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, CardFooter } from "@nextui-org/react"
import { Chapter, Lesson } from "@prisma/client"
import { ImageIcon } from "lucide-react"
import React, { startTransition, useRef, useState } from "react"
import ReactCrop, { Crop, centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop"
import { toast } from "react-toastify"

const MAX_IMAGE_SIZE = 4 * 1024 * 1024
const MIN_DIMENSION = 100
const ASPECT_RATIO = 16/9
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

const LessonVideoImageForm = ({
    chapter,
    lesson,
    onUpdate
} : {
    chapter: Chapter,
    lesson: Lesson,
    onUpdate: () => void
}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const imgRef = useRef<HTMLImageElement>(null)
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [uploading, setUploading] = useState(false)
    const [crop, setCrop] = useState<Crop>()
    const [imgSrc, setImgSrc] = useState<string>()

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > MAX_IMAGE_SIZE) {
            toast.error(`Maksymalny rozmiar pliku to 4 MB`)
            return
        }

        const reader = new FileReader()
        reader.addEventListener("load", ()=>{
            const imageUrl = reader.result?.toString()
            setImgSrc(imageUrl)
            onOpen()
            e.target.value=""
        })
        reader.readAsDataURL(file)
    }

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            toast.error(`Minimalne wymiary obrazka to ${MIN_DIMENSION} px`)
            onOpenChange()
            return
        }
        const cropWidthInPercent = (MIN_DIMENSION / width * 100)
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent
            },
            ASPECT_RATIO,
            width,
            height
        )
        const centeredCrop = centerCrop(crop, width, height)
        setCrop(centeredCrop)
    }

    const setCanvasPreview = (
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        crop: Crop
    ) => {
        const ctx = canvas.getContext("2d")
        if (!ctx) {
            throw new Error("Brak kontekstu")
        }
        const pixelRatio = window.devicePixelRatio
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = "high"
        ctx.save()

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        ctx.translate(-cropX, -cropY)
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight
        )
        ctx.restore()
    }

    const handleUpload = async () => {
        if (!previewCanvasRef.current || !imgRef.current || !crop) {
            toast.error("Wystąpił błąd podczas przesyłania obrazka.")
            return
        }

        setUploading(true)
        setCanvasPreview(imgRef.current, previewCanvasRef.current, convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height))
        const dataURL = previewCanvasRef.current.toDataURL()

        startTransition(async ()=>{
            await UploadLessonVideoImage(dataURL, chapter.courseId, chapter.id, lesson.id)
                .then(()=>{
                    toast.success("Obrazek przesłany pomyślnie!");
                    onOpenChange()
                    onUpdate()
                })
                .catch((error)=>{
                    toast.error(error.message)
                })
                .finally(()=>{
                    setUploading(false)
                })
        })
    }

    return (
        <main>
            <CardHeader className="flex justify-between">
                Obrazek wyróżniający
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    style={{display: "none"}}
                />
            </CardHeader>
            <CardBody>
                {lesson.ImageURL ? (
                    <Image
                        width={160*3}
                        height={90*3}
                        className="max-h-fit w-auto"
                        alt={"Obrazek lekcji"}
                        src={lesson.ImageURL}
                    />
                ) : (
                    <div className="h-auto w-full aspect-video flex items-center justify-center bg-primary/10">
                        <ImageIcon className="h-10 w-10"/>
                    </div>
                )}
            </CardBody>
            <CardFooter>
                <Button color="primary" onClick={()=> fileInputRef.current?.click()}>
                    {lesson.ImageURL ? "Zmień obraz" : "Dodaj obraz"}
                </Button>
            </CardFooter>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="opaque"
                scrollBehavior="outside"
                placement="center"
                size="4xl"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose)=>(
                        <>
                            <ModalHeader>
                                Przytnij obraz
                            </ModalHeader>
                            <ModalBody>
                                {imgSrc && (
                                    <ReactCrop
                                        crop={crop}
                                        keepSelection
                                        aspect={ASPECT_RATIO}
                                        minWidth={MIN_DIMENSION}
                                        onChange={
                                            (pixelCrop, percentCrop)=>{setCrop(percentCrop)}
                                        }
                                        className="flex"
                                    >
                                        <Image
                                            ref={imgRef}
                                            width={1600}
                                            height={900}
                                            className="max-h-fit w-auto"
                                            src={imgSrc}
                                            alt={"Crop"}
                                            onLoad={onImageLoad}
                                        />
                                    </ReactCrop>
                                )}
                            </ModalBody>
                            <ModalFooter className="flex justify-between items-center">
                                Możesz dostosować obraz, powiększając go lub pomniejszając i przeciągając do żądanej pozycji.
                                <Button type="submit" color="primary" onClick={handleUpload} isDisabled={uploading} isLoading={uploading}>
                                    {uploading ? "Przesyłanie..." : "Przytnij i prześlij"}
                                </Button>
                            </ModalFooter>
                            {crop && (
                                <canvas
                                    ref={previewCanvasRef}
                                    style={{
                                        display: "none"
                                    }}
                                >
                                </canvas>
                            )}
                        </>
                    )}
                </ModalContent>
                
            </Modal>
        </main>
    )
}
export default LessonVideoImageForm