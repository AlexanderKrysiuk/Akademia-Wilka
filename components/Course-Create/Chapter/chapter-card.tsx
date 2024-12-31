//V3
"use client";

import { unpublishChapter } from "@/actions/chapter-teacher/chapter";
import { GetLessonsByChapterId } from "@/actions/lesson-teacher/lesson";
import PageLoader from "@/components/page-loader";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Card, CardHeader } from "@nextui-org/card";
import { Chapter, Lesson } from "@prisma/client";
import { Eye, EyeOff, Scroll } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import ChapterEditModal from "./chapter-edit-modal";
import ChapterDeleteModal from "./chapter-delete-modal";

const ChapterCard = ({
    chapter,
    dragHandleProps,
    onUpdate,
}: {
    chapter: Chapter;
    dragHandleProps: DraggableProvidedDragHandleProps | null;
    onUpdate: () => void;
}) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [completedFieldsNumber, setCompletedFieldsNumber] = useState(0);
    const [requiredFieldsNumber, setRequiredFieldsNumber] = useState(0);

    const fetchLessonsFromChapter = useCallback(async () => {
        try {
            const data = await GetLessonsByChapterId(chapter.id);
            setLessons(data);

            // Sprawdzanie możliwości publikacji rozdziału
            const requiredFields = [
                chapter.title,
                chapter.slug,
                data.some((lesson) => lesson.published),
            ];
            const completedFields = requiredFields.filter(Boolean).length;

            setCompletedFieldsNumber(completedFields);
            setRequiredFieldsNumber(requiredFields.length);

            if (completedFields < requiredFields.length && chapter.published) {
                await unpublishChapter(chapter.id);
                toast.warning("Rozdział zmienił status na szkic");
                onUpdate();
            }
        } catch (error) {
            console.error("[FETCH LESSONS ERROR]", error);
            toast.error("Nie udało się pobrać lekcji");
        } finally {
            setLoading(false);
        }
    }, [chapter, onUpdate]);

    useEffect(() => {
        fetchLessonsFromChapter();
    }, [fetchLessonsFromChapter]);

    const handleUpdate = useCallback(() => {
        fetchLessonsFromChapter();
        onUpdate();
    }, [fetchLessonsFromChapter, onUpdate]);

    if (loading) return <PageLoader />;

    return (
        <Card>
            <CardHeader className="gap-x-2">
                <div {...dragHandleProps}>
                    <Scroll className="hover:text-primary transition duration-300" />
                </div>
                <div className="truncate w-full">{chapter.title}</div>
                <div className="text-sm">
                    {chapter.published ? <Eye /> : <EyeOff />}
                </div>
                <ChapterEditModal
                    chapter={chapter}
                    requiredFieldsNumber={requiredFieldsNumber}
                    completedFieldsNumber={completedFieldsNumber}
                    lessons={lessons}
                    onUpdate={handleUpdate}
                />
                <ChapterDeleteModal chapter={chapter} onUpdate={handleUpdate} />
            </CardHeader>
        </Card>
    );
};

export default ChapterCard;


// //V1
// "use client"

// import { unpublishChapter } from "@/actions/chapter-teacher/chapter";
// import { GetLessonsByChapterId } from "@/actions/lesson-teacher/lesson";
// import PageLoader from "@/components/page-loader";
// import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
// import { Card, CardBody, CardHeader } from "@nextui-org/card";
// import { Chapter, Lesson } from "@prisma/client";
// import { ChevronUp, Eye, EyeOff, Scroll } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import ChapterEditModal from "./chapter-edit-modal";
// import ChapterDeleteModal from "./chapter-delete-modal";
// import LessonsList from "../Lesson/lessons-list";
// import { motion } from "framer-motion";

// const ChapterCard = ({
//     chapter,
//     dragHandleProps,
//     onUpdate
// }:{
//     chapter: Chapter;
//     dragHandleProps: DraggableProvidedDragHandleProps | null;
//     onUpdate: () => void;
// }) => {
//     const [lessons, setLessons] = useState<Lesson[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [completedFieldsNumber, setCompletedFieldsNumber] = useState(0)
//     const [requiredFieldsNumber, setRequiredFieldsNumber] = useState(0)
//     const [dataReady, setDataReady] = useState(false)
//     const [expanded, setExpanded] = useState(false);

//     //const requiredFields = [
//     //    chapter.title,
//     //    chapter.slug,
//     //    lessons.some(lesson => lesson.published)
//     //];
//     //const completedFields = requiredFields.filter(Boolean).length;

//     //const fetchLessons = useCallback(async () => {
//     //    const fetchedLessons = await GetLessonsByChapterId(chapter.id);
//     //    setLessons(fetchedLessons);
//     //}, [chapter.id]);

//     const fetchLessonsFromChapter = useCallback(() => {
//         GetLessonsByChapterId(chapter.id)
//             .then((data)=>{
//                 setLessons(data)
//                 setLoading(false)
//             }) 
//             .catch((error) => {
//                 console.error("[FETCH LESSONS ERROR]", error);
//                 toast.error(error || "Nie udało się pobrać lekcji");
//             })
//     },[chapter])

//     // async function fetchLessonsFromChapter () {
//     //     setDataReady(false)
//     //     await GetLessonsByChapterId(chapter.id)
//     //         .then((data)=>setLessons(data))
//     //         .catch((error)=>{
//     //             console.log("[FETCH LESSONS FROM CHAPTER ERROR]",error)
//     //             toast.error(error || "Nie udało się pobrać lekcji")
//     //         })
//     //     setDataReady(true)
//     //     setLoading(false)
//     // }

//     //useEffect(()=>{
//     //    fetchLessonsFromChapter()
//     //},[chapter])
//     useEffect(() => {
//         fetchLessonsFromChapter();
//     }, [fetchLessonsFromChapter]);
    

//     async function checkIfChapterCanBePublished(chapter: Chapter, lessons: Lesson[]) {
//         const requiredFields = [
//             chapter.title,
//             chapter.slug,
//             lessons.some(lessons => lessons.published)
//         ]

//         const completedFields = requiredFields.filter(Boolean).length;

//         if (completedFields < requiredFields.length && chapter.published) {
//             await unpublishChapter(chapter.id)
//                 .then((data)=>{
//                     console.info(data)
//                     toast.warning("Rozdział zmienił status na szkic")
//                 })
//                 .catch((error)=>{
//                     console.error("[UNPUBLISH CHAPTER ERROR]",error)
//                     toast.error(error || "Nastąpił nieoczekiwany błąd")
//                 })
//                 .finally(onUpdate)
//         }

//         setCompletedFieldsNumber(completedFields)
//         setRequiredFieldsNumber(requiredFields.length)
//     }

//     useEffect(()=>{
//         if (dataReady && chapter && lessons) checkIfChapterCanBePublished(chapter, lessons)
//     }, [chapter, lessons])

//     //useEffect(() => {
//     //    if (completedFields < requiredFields.length && chapter.published) {
//     //        unpublishChapter(chapter.id);
//     //        toast.warning("Rozdział zmienił status na: szkic, uzupełnij wszystkie pola by go opublikować");
//     //    }
//     //    fetchLessons();
//     //    setLoading(false);
//     //}, [chapter.id, chapter.published, completedFields, requiredFields.length, fetchLessons]);

//     if (loading) return <PageLoader/>;

//     return ( 
//         <Card>
//             <CardHeader className="gap-x-2">
//                 <div {...dragHandleProps}>
//                     <Scroll className="hover:text-primary transition duration-300"/>
//                 </div>
//                 <div className="truncate w-full">
//                     {chapter.title}
//                 </div>
//                 <div className="text-sm">
//                     {chapter.published ? (
//                         <Eye/>
//                     ) : (
//                         <EyeOff/>
//                     )}
//                 </div>
//                 <ChapterEditModal
//                     chapter={chapter}
//                     requiredFieldsNumber={requiredFieldsNumber}
//                     completedFieldsNumber={completedFieldsNumber}
//                     lessons={lessons}
//                     onUpdate={onUpdate}
//                 />
//                 <ChapterDeleteModal
//                     chapter={chapter}
//                     onUpdate={onUpdate}
//                 />
//             </CardHeader>
//         </Card>
//     );
// }
 
// export default ChapterCard;
