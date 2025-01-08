"use client"

import "react-image-crop/dist/ReactCrop.css";
import { useCurrentUser } from "@/hooks/user";
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { UserRole } from "@prisma/client";
import { ImageIcon, ImagePlus, Images } from "lucide-react";
import { startTransition, useRef, useState } from "react";
import ReactCrop, { Crop, centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import { toast } from "react-toastify";
import { uploadCourseImage } from "@/actions/course-teacher/image";
import { number } from "zod";
import { useRouter } from "next/navigation";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MIN_DIMENSION = 100;
const ASPECT_RATIO = 16/9;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ImageCard = ({
    courseId,
    imageUrl,
}: {
    courseId: string;
    imageUrl: string | null;
}) => {
    const user = useCurrentUser();

    // Ensure hooks are called unconditionally at the top of the component
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const imgRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [imgSrc, setImgSrc] = useState<string>();
    const router = useRouter()

    if (!user || !user.role.includes(UserRole.Teacher || UserRole.Admin)) return null;

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_IMAGE_SIZE) {
            toast.error(`Maksymalny rozmiar pliku to 4 MB`);
            return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageUrl = reader.result?.toString();
            setImgSrc(imageUrl);
            onOpen();
            e.target.value = "";
        });
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            toast.error(`Minimalne wymiary obrazka to ${MIN_DIMENSION} px`);
            onOpenChange();
            return;
        }
        const cropWidthInPercent = (MIN_DIMENSION / width * 100);
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    const setCanvasPreview = (
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        crop: Crop
    ) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Brak kontekstu");
        }

        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = "high";
        ctx.save();

        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;

        ctx.translate(-cropX, -cropY);
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
        );

        ctx.restore();
    };

    const handleUpload = async () => {
        if (!previewCanvasRef.current || !imgRef.current || !crop) {
            toast.error("Wystąpił błąd podczas przesyłania obrazka.");
            return;
        }

        setUploading(true);
        setCanvasPreview(imgRef.current, previewCanvasRef.current, convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height));
        const dataURL = previewCanvasRef.current.toDataURL();

        startTransition(async () => {
            await uploadCourseImage(dataURL, courseId)
                .then(() => {
                    toast.success("Obrazek przesyłany pomyślnie!");
                    onOpenChange();
                    router.refresh()
                })
                .catch((error) => {
                    toast.error(error.message);
                })
                .finally(() => {
                    setUploading(false);
                });
        });
    };

    return (
        <main>
            <Card>
                <CardHeader className="flex justify-between">
                    <h6>Obrazek</h6>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onSelectFile}
                        style={{ display: "none" }}
                    />
                    <Button variant="light" color="primary" onClick={() => fileInputRef.current?.click()} startContent={imageUrl ? <Images size={16}/> : <ImagePlus size={16}/>}>
                        {imageUrl ? "Zmień obraz" : "Dodaj obraz"}
                    </Button>
                </CardHeader>
                <CardBody>
                    {imageUrl ? (
                        <Image
                            width={160 * 3}
                            height={90 * 3}
                            className="max-h-fit w-auto"
                            alt={"Obrazek kursu"}
                            src={imageUrl}
                        />
                    ) : (
                        <div className="h-full w-full aspect-video flex items-center justify-center bg-primary/10 ">
                            <ImageIcon className="h-10 w-10"/>
                        </div>
                    )}
                </CardBody>
            </Card>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="opaque"
                size="4xl"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Przytnij obraz
                            </ModalHeader>
                            <ModalBody className="flex items-center justify-center">
                                {imgSrc && (   
                                    <ReactCrop
                                        crop={crop}
                                        keepSelection
                                        aspect={ASPECT_RATIO}
                                        minWidth={MIN_DIMENSION}
                                        onChange={(pixelCrop, percentCrop) => { setCrop(percentCrop); }}
                                        className="max-h-[69vh] w-auto"
                                    >
                                        <Image
                                            width={1600}
                                            height={900}
                                            src={imgSrc}
                                            alt="Upload"
                                            onLoad={onImageLoad}
                                            ref={imgRef}
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
                                        display: "none",
                                        border: "1px solid black",
                                        objectFit: "contain",
                                        width: "160",
                                        height: "90"
                                    }}
                                />
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
    );
};

export default ImageCard;
