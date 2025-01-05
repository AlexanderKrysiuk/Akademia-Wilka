"use client"

import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import LessonMenu from "./lesson-menu";
import { Chapter, Course, Lesson } from "@prisma/client";

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

    const [menuVisible, setMenuVisible] = useState(false)
    
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const handleResize = () => setMenuVisible(mediaQuery.matches);
        handleResize(); // Sprawdź początkowy stan
        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);
    return ( 
        <main className="w-full h-full flex flex-row">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: menuVisible ? "25%" : "0%" }}
            transition={{ duration: 0.3 }}
            className="shadow-lg overflow-hidden h-full border-r-white border-r-1"
        >
            <div className="h-full w-full overflow-y-auto max-w-1/4">
                <LessonMenu 
                    course={course} 
                    chapters={chapters} 
                    lessons={lessons}
                    completedLessons={completedLessons}
                />
            </div>
        </motion.div>
        <div className="w-full h-full border-4 border-violet-500">
            <div className="bg-primary text-white w-full flex flex-row">
                <Button
                    isIconOnly
                    color="primary"
                    onClick={()=>{setMenuVisible(!menuVisible)}}
                >
                    <motion.div
                        animate={{ rotate: menuVisible ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight/>
                    </motion.div>
                </Button>
                <div className="w-full flex justify-center items-center">
                    Lesson Navbar
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    </main>
     );
}
 
export default CourseLayoutWrapper;