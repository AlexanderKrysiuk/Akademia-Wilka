"use client"

import { format } from "path";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import axios from "axios"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface BuyCourseButtonProps {
    price: number,
    courseId: string
}

const CoursePurchaseButton = ({
    price,
    courseId
}:BuyCourseButtonProps) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const onClick = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`/api/courses/${courseId}/checkout`)
            router.push(`${response.data.url}`)
        } catch (error) {
            toast.error("Wystąpił błąd, proszę spróbować ponownie.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button size={`sm`} onClick={onClick} className="w-full">
            Uzyskaj dostęp do kursu za {formatPrice(price)}

            {/* 
            <Button size={`sm`} className="w-full">
            {price == 0 ? (
                <div>
                Dodaj do biblioteki
                </div>
            ):(
                <div>
                Uzyskaj dostęp za: {formatPrice(price)}
                </div>
            )}
            </Button>
            */}
        </Button>


     );
}
 
export default CoursePurchaseButton;