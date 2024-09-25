"use client"

import { useCurrentUser } from "@/hooks/user";
import { Button } from "../ui/button";
import Link from "next/link";
import { startTransition, useEffect, useState, useTransition } from "react";
import { findPurchase } from "@/actions/course/purchase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Tab, Tabs } from "@nextui-org/tabs";
import LoginForm from "../auth/login-form";
import RegisterForm from "../auth/register-form";

interface CourseActionButtonProps{
    courseSlug: string
    courseId: string
}

const CourseActionButton = ({
    courseSlug,
    courseId
}:CourseActionButtonProps) => {
    const [coursePurchased, setCoursePurchased] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false)

    const user = useCurrentUser()
    const router = useRouter()

    useEffect(()=>{
        if (user) {
            startTransition(async()=>{
                const purchase = await findPurchase(courseId, user.id)
                if (purchase) {
                    setCoursePurchased(true)
                }
            })
        }
    }, [user, courseId])

    const handleCheckout = async () => {  
        try {
            setLoading(true)
            const respone = await axios.post(`/api/koszyk/kurs/${courseId}/checkout`)
            router.push(respone.data.url)
        } catch (error) {
            toast.error("Wystąpił błąd, proszę spróbować ponownie")
        } finally {
            setLoading(false)
        }
    };

    if (isPending) {
        <Button className="w-full" disabled>
            <Loader2 className="animate-spin mr-[1vw]"/>
            Sprawdzanie zakupu...
        </Button>
    }
 
    return (
        <div>
            {user ? (
                <div>
                    {coursePurchased ? (
                        <Button className="w-full">
                            Kupiony
                        </Button>
                    ):(
                        <Button onClick={handleCheckout} className="w-full">
                            Uzyskaj dostęp
                        </Button>
                    )}

                </div>
            ):( 
                <Button onClick={handleCheckout} className="w-full">
                    Uzyskaj dostęp
                </Button>
                
            )}
        </div>
     );
}
 
export default CourseActionButton;