"use client"

import convertToSubcurrency from "@/lib/convertToSubcurency"
import { Button } from "@nextui-org/react"
import {
    useStripe,
    useElements,
    PaymentElement
} from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"

const CourseCheckoutPage = ({
    amount
} : {
    amount:number
}) => {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount)})
        })
        .then((res)=>res.json())
        .then((data)=>setClientSecret(data.clientSecret))
    },[amount])

    return (
        <form>
            {clientSecret && <PaymentElement/>}
            <Button>
                pay
            </Button>
        </form>
    )
}
 
export default CourseCheckoutPage;