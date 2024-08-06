"use client"
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import RenderResultMessage from "@/components/render-result-message";
import { BeatLoader } from "react-spinners"
import { NewVerification } from "@/actions/auth/new-verification";

const NewVerificationForm = () => {
    const [result, setResult] = useState<{ success: boolean, message: string} | null>(null)
    
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (result) return;
        if(!token) {
            setResult({ success: false, message: "Nie znaleziono tokenu!" })
            return
        };
        NewVerification(token)
            .then((data) => {
                setResult({ success: data.success, message: data.message })
            })
    }, [token, result])

    useEffect(()=> {
        onSubmit();
    }, [onSubmit])
    
    return ( 
        <div className="flex items-center justify-center">
            <div>
                {!result ? (
                    <BeatLoader/>
                ) : (
                    RenderResultMessage(result)
                )}
            </div>
        </div>
    );
}
 
export default NewVerificationForm;