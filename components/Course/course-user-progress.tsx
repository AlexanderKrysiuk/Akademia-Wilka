{/*
"use client"

import { getLessonsCountByCourseID } from "@/actions/course/lesson";
import { getCompletedLessonsCountByCourseID } from "@/actions/course/progress";
import { findPurchase } from "@/actions/course/purchase";
import { useCurrentUser } from "@/hooks/user";
import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";

interface CourseUserProgressProps {
    courseID: string
}

const CourseUserProgress = ({
    courseID
}: CourseUserProgressProps) => {
    const [completedLessons, setCompletedLessons] = useState<number>(0);
    const [lessons, setLessons] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [coursePurchased, setCoursePurchased] = useState<boolean>(false);
    const user = useCurrentUser();

    const fetchPurchase = async () => {
        const purchased = await findPurchase(courseID, user.id)
        if(purchased){
            setCoursePurchased(true)
        }
    }

    const fetchAllLessons = async () => {
        const lessons = await getLessonsCountByCourseID(courseID)
        setLessons(lessons)
    }

    const fetchCompletedLessons = async () => {
        const completedLessons = await getCompletedLessonsCountByCourseID(courseID, user.id)
        setCompletedLessons(completedLessons)
    } 
    useEffect(() => {
        fetchAllLessons()
        if(user) {
            fetchPurchase()
        }
        if(coursePurchased){
            fetchCompletedLessons()
        }
    }, []);
    
    const progress = lessons > 0 ? (completedLessons / lessons) * 100 : 0;
    
    return (
        coursePurchased ? (
            <div className="py-[3vh]">
                <h6>
                    Postęp w kursie
                </h6>
            <div className="w-full flex items-center justify-between">
                <div className="w-full">
                    {completedLessons}/{lessons}    
                </div>
                <div>
                    {progress}%
                </div>
            </div>
                <Progress value={progress}/>
            </div>
        ) : (
            <div>Purchase the course to see your progress.</div>
        )
    );
}

export default CourseUserProgress;


import { getLessonsCountByCourseID } from "@/actions/course/lesson";
import { getCompletedLessonsCountByCourseID } from "@/actions/course/progress";
import { findPurchase } from "@/actions/course/purchase";
import { useCurrentUser } from "@/hooks/user";
import { startTransition, useEffect, useState } from "react";

interface CourseUserProgressProps {
    courseID:string
}

const CourseUserProgress = ({
    courseID
}:CourseUserProgressProps) => {
    const [completedLessons, setCompletedLessons] = useState<number>(0)
    const [lessons, setLessons] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [coursePurchased, setCoursePurchased] = useState<boolean>(false)
    const user = useCurrentUser()

    useEffect(()=>{
        startTransition(async()=>{
            if(user) {
                const completedLessons = await getCompletedLessonsCountByCourseID(courseID, user.id) 
                if(completedLessons) {
                    setCompletedLessons(completedLessons)
                }
                const coursePurchased = await findPurchase(courseID, user.id)
                if (coursePurchased) {
                    setCoursePurchased(true)
                }
            }
            const lessons = await getLessonsCountByCourseID(courseID)
            if(lessons){
                setLessons(lessons)
            }
        })
    },[])
    
    return (
        coursePurchased && (
            <div className="w-full">
            {completedLessons}/{lessons}
            </div>
        )
     );
}

export default CourseUserProgress;
*/}