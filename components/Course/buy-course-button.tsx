"use client"

import { format } from "path";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/format";

interface BuyCourseButtonProps {
    price: number,
    courseId: string
}

const BuyCourseButton = ({
    price,
    courseId
}:BuyCourseButtonProps) => {
    return ( 
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
     );
}
 
export default BuyCourseButton;