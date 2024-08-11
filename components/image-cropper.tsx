// ImageCropper.tsx
import React, { useState, useRef, useEffect, useTransition } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { uploadCourseImage } from "@/actions/file/upload-course-image"; // Import funkcji do wysyłania obrazu
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MIN_DIMENSION = 100;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

interface ImageCropperProps {
    onCancel: () => void;
    courseId: string; // Dodaj prop dla courseId
    userId: string; // Dodaj prop dla userId
    imageFile: File | null; // Dodaj prop dla wybranego pliku
    onUpdate: () => void; // Dodano onUpdate
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onCancel, courseId, userId, imageFile, onUpdate }) => {
    const [imgSrc, setImgSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>();
    const imgRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isPending, startTransition] = useTransition(); // Stan do zarządzania oczekiwaniem


    useEffect(() => {
        if (imageFile) {
            if (imageFile.size > MAX_IMAGE_SIZE) {
                toast({
                    title: "❌ Błąd!",
                    description: "Zdjęcie przekracza maksymalny rozmiar 4 MB!",
                    variant: "failed",
                });
                return; // Przerwij, jeśli rozmiar pliku jest za duży
            }

            if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
                toast({
                    title: "❌ Błąd!",
                    description: "Dozwolone typy plików to: JPEG, PNG, GIF!",
                    variant: "failed",
                });
                return; // Przerwij, jeśli typ pliku nie jest dozwolony
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        }
    }, [imageFile]);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;

        if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
            toast({
                title: "❌ Błąd!",
                description: "Minimalne wymiary obrazu to 100x100 pikseli!",
                variant: "failed",
            });
            return; // Przerwij, jeśli wymiary są za małe
        }

        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const initialCrop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent
            },
            16 / 9,
            width,
            height
        );
        const centeredCrop = centerCrop(initialCrop, width, height);
        setCrop(centeredCrop);
    };

    const setCanvasPreview = (
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        crop: Crop
    ) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Nie ma kontekstu");
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

    const handleUploadCourseImage = async () => {
        if (imgRef.current && crop && previewCanvasRef.current) {
            setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                )
            );
            const dataURL = previewCanvasRef.current.toDataURL();

            // Konwersja dataURL na Blob
            const response = await fetch(dataURL);
            const blob = await response.blob();
            
            // Utworzenie FormData
            const formData = new FormData();
            formData.append('image', blob, `course-image-${courseId}.png`); // Dodanie pliku
            formData.append('courseId', courseId); // Dodanie ID kursu
            formData.append('userId', userId); // Dodanie ID użytkownika
    
            // Wyślij obrazek na serwer
            try {
                startTransition(()=> {
                    //await uploadCourseImage(formData); // Zaktualizuj tę funkcję w zależności od tego, jak wysyłasz obrazek
                    uploadCourseImage(formData)
                        .then(() => {
                            toast({
                                title: "✅ Sukces!",
                                description: "Zdjęcie zostało przesłane!",
                                variant: "success",
                            });
                            onCancel(); // Zamknij edytor po przesłaniu
                            onUpdate(); // Wywołanie onUpdate po pomyślnym przesłaniu
                        })
                        .catch((error) => {
                            toast({
                                title: "❌ Błąd!",
                                description: "Wystąpił błąd podczas przesyłania zdjęcia.",
                                variant: "failed",
                            });
                        });
                })
            } catch (error) {
                toast({
                    title: "❌ Błąd!",
                    description: "Wystąpił błąd podczas przesyłania zdjęcia.",
                    variant: "failed",
                });
            }
        }
    };

    return (
        <div>
            {imgSrc && (
                <div className="fixed z-50 inset-0 flex items-center bg-black bg-opacity-50 justify-center">
                    <Card className="bg-background px-[4vw] py-[4vh] max-w-[1200px] overflow-auto max-h-[90vh]">
                        <CardHeader>
                            <CardTitle className='flex justify-between items-center'>
                                Przytnij obraz
                                <Button variant="link" onClick={onCancel} disabled={isPending}>
                                    <X/>
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                aspect={16 / 9}
                                keepSelection
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    style={{ maxHeight: '300px' }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                            <div className="hidden">
                                <canvas ref={previewCanvasRef} />
                            </div>
                        </CardContent>
                        <CardFooter className='flex items-center justify-between'>
                            <div className='max-w-[60%]'>
                                Możesz dostosować obraz, powiększając go lub pomniejszając i przeciągając do żądanej pozycji.
                            </div>
                            <Button onClick={handleUploadCourseImage} disabled={isPending}>
                                Prześlij
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ImageCropper;
