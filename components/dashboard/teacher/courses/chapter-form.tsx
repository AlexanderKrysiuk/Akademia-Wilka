"use client";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { getChaptersByCourseID, moveChapter } from "@/actions/course/chapter"; // Upewnij się, że masz tę funkcję w swoim module
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Scroll, SquarePen, SquarePlus, X } from "lucide-react";
import AddChapterForm from "./add-chapter-form";
import EditChapterForm from "./edit-chapter-form";
import DeleteChapterForm from "./delete-chapter-form";
import LessonsList from "./lessons-list";
import React from "react";

interface ChapterFormProps {
    course: {
        id: string;
    };
    userID: string;
}

const ChapterForm = ({ course, userID }: ChapterFormProps) => {
    const [addChapterModal, setAddChapterModal] = useState(false);
    const [editChapterModal, setEditChapterModal] = useState(false);
    const [deleteChapterModal, setDeleteChapterModal] = useState(false);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [chapter, setChapter] = useState<Chapter | undefined>();
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    const firstCardRef = useRef<HTMLDivElement>(null);
    const [firstCardHeight, setFirstCardHeight] = React.useState<number | null>(null)
    

    const fetchChapters = async () => {
        const chapters = await getChaptersByCourseID(course.id);
        setChapters(chapters);
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    useEffect(() => {
        // Ustaw wysokość pierwszego elementu po każdej aktualizacji chapters
        if (firstCardRef.current) {
            setFirstCardHeight(firstCardRef.current.clientHeight);
        }
    }, [chapters]);

    const toggleExpandChapter = (chapterID: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapterID) ? prev.filter(id => id !== chapterID) : [...prev, chapterID]
        );
    };

    const editChapter = (chapter: Chapter) => {
        setChapter(chapter);
        setEditChapterModal(true);
    };

    const deleteChapter = (chapter: Chapter) => {
        setChapter(chapter);
        setDeleteChapterModal(true);
    };

    const handleDragEnd = async (result: any) => {
        const { source, destination } = result;

        if (!destination || source.index === destination.index) return;

        // Zaktualizuj lokalny stan rozdziałów
        const updatedChapters = Array.from(chapters);
        const [movedChapter] = updatedChapters.splice(source.index, 1);
        updatedChapters.splice(destination.index, 0, movedChapter);

        setChapters(updatedChapters);

        // Zaktualizuj kolejność na serwerze
        await moveChapter(course.id, movedChapter.id, destination.index + 1);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(chapters);
        const [reorderedItems] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItems)

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items)

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }))
    }

    return (
<div>
    <Card>
        <CardHeader>
            <h2 className="w-full flex items-center justify-between">
                Rozdziały kursu
                <Button
                    variant={'link'}
                    className="gap-x-[1vw]"
                    onClick={() => setAddChapterModal(true)}
                >
                    <SquarePlus /> Dodaj rozdział
                </Button>
            </h2>
        </CardHeader>
        <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="chapters">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {chapters.map((chapter,index) => (
                                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className="mb-[1vh]">
                                            <Card className="w-full">
                                                <div className="flex items-center px-[1vw] py-[1vh] justify-between">
                                                    <div className="flex items-center gap-x-[1vw]">
                                                        <div {...provided.dragHandleProps} className="hover:text-primary transition duration-300">
                                                            <Scroll/>
                                                        </div>
                                                        {chapter.title}
                                                    </div>
                                                    <div className="flex items-center gap-x-[1vw]">
                                                        <SquarePen
                                                            className="hover:text-primary transition duration-300 cursor-pointer"
                                                            onClick={() => editChapter(chapter)}
                                                        />
                                                        <X
                                                            className="hover:text-red-500 transition duration-300 cursor-pointer"
                                                            onClick={() => deleteChapter(chapter)}
                                                        />
                                                        {expandedChapters.includes(chapter.id) ? 
                                                            <ChevronUp 
                                                                onClick={() => toggleExpandChapter(chapter.id)}
                                                                className="hover:text-primary transition duration-300 cursor-pointer"
                                                            /> 
                                                            : 
                                                            <ChevronDown 
                                                                onClick={() => toggleExpandChapter(chapter.id)}
                                                                className="hover:text-primary transition duration-300 cursor-pointer"
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                                {expandedChapters.includes(chapter.id) && (
                                                    <CardContent>
                                                        <LessonsList 
                                                            chapterID={chapter.id} 
                                                            userID={userID}    
                                                        />
                                                    </CardContent>
                                                )}
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </CardContent>
        <CardFooter>
            Przeciągnij i upuść by ustalić kolejność rozdziałów
        </CardFooter>
    </Card>
        {/*
    <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="droppable" type="CARD">
    {(provided) => (
        <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        >
        <Card>
        <CardHeader>
        <h2 className="w-full flex items-center justify-between">
        Rozdziały kursu
        <Button
        variant={'link'}
                                        className="gap-x-[1vw]"
                                        onClick={() => setAddChapterModal(true)}
                                        >
                                        <SquarePlus /> Dodaj rozdział
                                        </Button>
                                        </h2>
                                        </CardHeader>
                                        <CardContent className="w-full">
                                        <div className="space-y-[1vh]">
                                        {chapters.length > 0 ? (
                                            chapters.map((chapter, index) => (
                                                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="mb-2"
                                                    >
                                                    <Card className="w-full">
                                                    <CardHeader>
                                                    <div className="flex flex-col space-y-[1vh] md:space-y-[0vh] md:flex-row items-center justify-between">
                                                    <div className="flex items-center gap-x-[1vw] overflow-hidden">
                                                    <Scroll />
                                                    <div className="w-full truncate">
                                                                            {chapter.title}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                    <Button
                                                                    variant={`link`}
                                                                    onClick={() => editChapter(chapter)}
                                                                    >
                                                                    <SquarePen />
                                                                    </Button>
                                                                    <Button
                                                                    variant={`link`}
                                                                    className="text-red-500 hover:bg-red-500/30"
                                                                    onClick={() => deleteChapter(chapter)}
                                                                    >
                                                                    <X />
                                                                    </Button>
                                                                    <Button
                                                                    variant={`link`}
                                                                    onClick={() => toggleExpandChapter(chapter.id)}
                                                                    >
                                                                    {expandedChapters.includes(chapter.id) ? <ChevronUp /> : <ChevronDown />}
                                                                    </Button>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            {expandedChapters.includes(chapter.id) && (
                                                                <CardContent>
                                                                    <LessonsList 
                                                                    chapterID={chapter.id} 
                                                                    userID={userID}    
                                                                    />
                                                                </CardContent>
                                                            )}
                                                            </Card>
                                                    </div>
                                                )}
                                                </Draggable>
                                        ))
                                    ) : (
                                        <div>Brak rozdziałów</div>
                                    )}
                                    {provided.placeholder}
                                    </div>
                                    </CardContent>
                                    </Card>
                                    </div>
                                )}
                                </Droppable>
                                {/* Modale do dodawania, edytowania i usuwania rozdziałów */}{/*
                                {addChapterModal && (
                                    <AddChapterForm
                                    course={course}
                                    userID={userID}
                                    onUpdate={() => {
                                        fetchChapters();
                                        setAddChapterModal(false);
                                    }}
                    onClose={() => setAddChapterModal(false)}
                    />
            )}
            {editChapterModal && (
                <EditChapterForm
                courseID={course.id}
                chapter={chapter}
                userID={userID}
                onClose={() => setEditChapterModal(false)}
                onUpdate={() => {
                    fetchChapters();
                    setEditChapterModal(false);
                }}
                />
            )}
            {deleteChapterModal && (
                <DeleteChapterForm
                courseID={course.id}
                chapter={chapter}
                userID={userID}
                onClose={() => setDeleteChapterModal(false)}
                onUpdate={() => {
                    fetchChapters();
                    setDeleteChapterModal(false);
                }}
                />
            )}
            </DragDropContext>
        */}
            {addChapterModal && (
                <AddChapterForm
                    course={course}
                    userID={userID}
                    onUpdate={() => {
                        fetchChapters();
                        setAddChapterModal(false);
                    }}
                    onClose={() => setAddChapterModal(false)}
                />
            )}
            {editChapterModal && (
                <EditChapterForm
                courseID={course.id}
                chapter={chapter}
                userID={userID}
                onClose={() => setEditChapterModal(false)}
                onUpdate={() => {
                    fetchChapters();
                    setEditChapterModal(false);
                }}
                />
            )}
            {deleteChapterModal && (
                <DeleteChapterForm
                courseID={course.id}
                chapter={chapter}
                userID={userID}
                onClose={() => setDeleteChapterModal(false)}
                onUpdate={() => {
                    fetchChapters();
                    setDeleteChapterModal(false);
                }}
                />
            )}
        </div>
    );
};

export default ChapterForm;
