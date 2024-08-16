"use client";

import ImageCropper from "@/components/image-cropper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquarePen, SquarePlus, ImageIcon } from "lucide-react"
import { useRef, useState } from "react";

interface ImageFormProps {
    course: {
        id:string
        imageUrl:string|null
    }
    userID: string
    onUpdate: () => void
}

const ImageForm = ({
    course,
    userID,
    onUpdate
}: ImageFormProps) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Stan do przechowywania wybranego pliku
    const [editImage, setEditImage] = useState(false);


    const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref do input file


    const handleEditImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImage(file); // Ustaw wybrany plik
            setEditImage(true); // Otwórz edycję obrazka
        }
    };

    return (
        <Card>
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Obrazek kursu
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={handleEditImageClick} // Otwórz okno wyboru pliku
                    >
                        {course.imageUrl ? (
                            <div className="flex items-center gap-x-[1vw]">
                                <SquarePen/> Zmień Obraz
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-[1vw]">
                                <SquarePlus /> Dodaj obraz
                            </div>
                        )}
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {course.imageUrl ? (
                    <img src={course.imageUrl} alt="Course Image" className="rounded-md" />
                ) : (
                    <div className="h-[20vh] flex items-center justify-center bg-primary/10 rounded-md">
                        <ImageIcon className="h-[5vh] w-[5vh]" />
                    </div>
                )}
            </CardContent>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }} // Ukryj input
                onChange={handleFileChange} // Obsłuż zmianę pliku
            />
            {editImage && selectedImage && ( // Przekaż wybrany obraz do ImageCropper
                <ImageCropper
                    onCancel={() => {
                        setEditImage(false);
                        setSelectedImage(null); // Resetuj wybrany plik
                    }}
                    courseId={course.id} // Dodaj id kursu
                    userId={userID} // Dodaj id użytkownika
                    imageFile={selectedImage} // Przekaż wybrany plik do croppera
                    onUpdate={() => {
                        setEditImage(false);
                        onUpdate()
                    }}
                />
            )}
        </Card>
    )
}
export default ImageForm