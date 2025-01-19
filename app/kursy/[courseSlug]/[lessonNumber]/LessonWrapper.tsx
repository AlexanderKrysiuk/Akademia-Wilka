"use client"

import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import { Course, Lesson } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import LessonMenu from "./Lesson-Menu";
import LessonDisplay from "./Lesson-Display";

const LessonWrapper = ({
    course,
    lessons,
    initialCompletedLessonsIds,
    lessonNumber,
    currentLesson,
}:{
    course: Course
    lessons: Lesson[]
    initialCompletedLessonsIds: string[]
    lessonNumber: number
    currentLesson: Lesson
}) => {
    const { isOpen, onOpen, onOpenChange} = useDisclosure()
    //const [completedLessonsIds, setCompletedLessonsIds] = useState<string[]>(initialCompletedLessonsIds)

    return ( 
        <main className="w-full h-full">
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
                                    lessons={lessons} 
                                    completedLessonsIds={initialCompletedLessonsIds}
                                    lessonNumber={lessonNumber}                          
                                />
                            </DrawerBody>
                            <DrawerFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Zamknij
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
            <div className="w-full h-full flex flex-row">
                <div className="w-1/4 h-full overflow-y-auto shadow-md dark:shadow-white hidden lg:block">
                    <LessonMenu 
                        course={course} 
                        lessons={lessons} 
                        completedLessonsIds={initialCompletedLessonsIds}
                        lessonNumber={lessonNumber}                          
                    />
                </div>
                <div className="w-full h-full flex flex-col overflow-y-auto">
                    <div className="bg-primary text-white w-full flex items-center">
                        <Button
                            isIconOnly
                            color="primary"
                            onPress={onOpen}
                            className="lg:hidden"
                        >
                            <ChevronRight/>
                        </Button>
                        <div className="flex w-full justify-center py-2">
                            {currentLesson.title}
                        </div>
                    </div>
                    <div>
                        <LessonDisplay
                            lesson={currentLesson}
                            lessons={lessons}
                            completedLessonsIds={initialCompletedLessonsIds}
                            course={course}
                        />
                    </div>
                </div>
            </div>
        </main>
     );
}
 
export default LessonWrapper;