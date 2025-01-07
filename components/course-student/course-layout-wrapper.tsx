"use client"

import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import LessonMenu from "./lesson-menu";
import { Chapter, Course, Lesson } from "@prisma/client";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@nextui-org/react";

//const CourseLayoutWrapper = ({children: course} : {children: React.ReactNode; course: any}) => {
const CourseLayoutWrapper = ({
    children, 
    course,
    chapters,
    lessons,
    completedLessons
} : {
    children: React.ReactNode, 
    course: Course
    chapters: Chapter[]
    lessons: Lesson[]
    completedLessons: string[]
}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onOpenChange={onOpenChange}
            >
                <DrawerContent>
                    {(onClose)=>(
                        <>
                            <DrawerHeader/>
                            <DrawerBody
                                className="px-0"
                            >
                                <LessonMenu 
                                    course={course} 
                                    chapters={chapters} 
                                    lessons={lessons}
                                    completedLessons={completedLessons}
                                    
                                />
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Zamknij
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
            <main className="w-full h-full flex flex-row">
                <div className="w-1/4 overflow-y-auto shadow-md dark:shadow-white hidden lg:block">
                    <LessonMenu 
                        course={course} 
                        chapters={chapters} 
                        lessons={lessons}
                        completedLessons={completedLessons}
                    />
                </div>
                <div className="w-full flex flex-col">

                    <div className="bg-primary text-white w-full flex items-center">
                        <Button
                            isIconOnly
                            color="primary"
                            onClick={onOpen}
                            className="lg:hidden"
                        >
                            <ChevronRight/>
                        </Button>
                        {/*
                        <span className="w-full flex justify-center">
                            Lesson Navbar
                        </span>
                        */}
                    </div>
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            </main>
        </>
    )
}
export default CourseLayoutWrapper;