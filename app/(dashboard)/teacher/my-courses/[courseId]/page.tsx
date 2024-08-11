"use client"
import { getCourseById } from "@/actions/course/get";
import { useCurrentUser } from "@/hooks/user";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ImageIcon, Settings, SquarePen, SquarePlus } from 'lucide-react';
import TitleForm from "@/components/dashboard/teacher/courses/title-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DescriptionForm from "@/components/dashboard/teacher/courses/description-form";
import ImageCropper from "@/components/image-cropper";

const CourseIdPage = ({
    params
}: {
    params: { courseId: string }
}) => {
    const user = useCurrentUser();
    const router = useRouter();
    const [course, setCourse] = useState<Course>();
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Stan do przechowywania wybranego pliku
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref do input file

    if (!user) {
        router.push("/");
        return;
    }

    if (!user.id){
        router.push("/");
        return;
    }

    if (!user?.role.teacher) {
        router.push("/");
        return;
    }

    const fetchCourse = async () => {
        const course = await getCourseById(params.courseId);
        if (!course) {
            router.push("/");
            return;
        }
        setCourse(course);
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    useEffect(() => {
        if (course && user) {
            if (course.ownerId !== user.id) {
                router.push("/");
            }
        }
    }, [course, user, router]);

    if (!course) {
        return <div>Ładowanie</div>;
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.levelId
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    // Funkcja do otwierania okna wyboru pliku
    const handleEditImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Funkcja obsługująca zmianę pliku
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImage(file); // Ustaw wybrany plik
            setEditImage(true); // Otwórz edycję obrazka
        }
    };

    return (
        <div className="w-full px-[1vw] py-[1vh] space-y-[1vh]">
            <Card className="py-[1vh] px-[1vw] w-full">
                <CardHeader>
                    <CardTitle>
                        <h1 className="flex gap-x-[1vw]"><Settings /> Ustawienia Kursu {completionText}</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    Uzupełnij wszystkie wymagane pola {completionText}
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1vw] gap-y-[1vh]">
                <Card className="py-[1vh] px-[1vw] w-full">
                    <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Tytuł kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={() => {
                                    setEditTitle(prev => !prev);
                                }}
                            >
                                {!editTitle && <SquarePen />}
                                {editTitle ? "Anuluj" : "Edytuj"}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent>
                        {editTitle ? (
                            <TitleForm
                                initialData={course}
                                userID={user?.id as string}
                                onUpdate={() => {
                                    fetchCourse();
                                    setEditTitle(false);
                                }}
                            />
                        ) : (
                            <h3>{course.title}</h3>
                        )}
                    </CardContent>
                </Card>
                <Card className="py-[1vh] px-[1vw] w-full">
                    <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Opis kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={() => {
                                    setEditDescription(prev => !prev);
                                }}
                            >
                                {!editDescription && <SquarePen />}
                                {editDescription ? "Anuluj" : "Edytuj"}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent>
                        {editDescription ? (
                            <DescriptionForm
                                initialData={course}
                                userID={user?.id as string}
                                onUpdate={() => {
                                    fetchCourse();
                                    setEditDescription(false);
                                }}
                            />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: course.description || "Brak opisu..." }} />
                        )}
                    </CardContent>
                </Card>
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
                    <CardContent>
                        {course.imageUrl ? (
                            <img src={course.imageUrl} alt="Course Image" />
                        ) : (
                            <div className="h-[20vh] flex items-center justify-center bg-primary/10 rounded-md">
                                <ImageIcon className="h-[5vh] w-[5vh]" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* Ukryty input do wyboru pliku */}
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
                    courseId={params.courseId} // Dodaj id kursu
                    userId={user.id} // Dodaj id użytkownika
                    imageFile={selectedImage} // Przekaż wybrany plik do croppera
                    onUpdate={() => {
                        fetchCourse();
                        setEditImage(false);
                    }}
                />
            )}
        </div>
    );
};
export default CourseIdPage;