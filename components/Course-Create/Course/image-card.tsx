"use client"

import ImageCropper from "@/components/image-cropper"
import { useCurrentUser } from "@/hooks/user"
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react"
import { UserRole } from "@prisma/client"
import { ImageIcon, ImagePlus, Images, Pen, PenOff } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

const ImageCard = ({
    courseId,
    imageUrl,
    onUpdate
} : {
    courseId: string
    imageUrl: string | null
    onUpdate: () => void
}) => {
    const user = useCurrentUser()

    if (!user || !user.role.includes(UserRole.Teacher || UserRole.Admin)) return

    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [edit, setEdit] = useState(false)

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleEditImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setSelectedImage(file)
            setEdit(true)
        }
    }

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <h6>Obrazek</h6>
                <Button variant="light" color="primary" onClick={handleEditImageClick} startContent={imageUrl ? <Images size={16}/> : <ImagePlus size={16}/>}>
                    {imageUrl ? "Zmień obraz" : "Dodaj obraz"}
                </Button>
            </CardHeader>
            <CardBody>
                {imageUrl ? (
                    <Image
                        fill
                        className="object-cover aspect-video"
                        alt={"Obrazek kursu"}
                        src={imageUrl}
                    />
                ) : (
                    <div className="h-full w-full aspect-video flex items-center justify-center bg-primary/10 ">
                        <ImageIcon className="h-10 w-10"/>
                    </div>
                )}
            </CardBody>
            <input 
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
                <ImageCropper
                    onCancel={()=>{
                        setEdit(false)
                        setSelectedImage(null)
                    }}
                    courseId={courseId}
                    userId={user.id}
                    imageFile={selectedImage}
                    onUpdate={()=>{
                        setEdit(false)
                        onUpdate()
                    }}
            />
        </Card>
    )
}
export default ImageCard