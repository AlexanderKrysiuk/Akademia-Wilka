"use client"

import { formatPrice } from "@/lib/format";
import { Button } from "@heroui/button";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CheckoutForm = ({ amount }: { amount: number }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch('/api/create-payment-intent',{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({ amount: Math.round(amount * 100)})
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Response from server:", data);
            setClientSecret(data.clientSecret)
        })
        setLoading(false)
    }, [amount])

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        if (!stripe || !elements) {
            return
        }

        const { error: submitError } = await elements.submit()

        if (submitError) {
            toast.error(submitError.message)
            setLoading(false)
            return
        }
        
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                //TODO: Confirmation Page
                return_url: "http://localhost:3000/"
            }
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Płatność udana!")
        }
        setLoading(false)
    }

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="w-full h-full flex items-center justify-center space-x-[1vw]">
                <Loader2 className="animate-spin"/>
                Ładowanie...
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-[1vh]">
            {clientSecret && 
                <PaymentElement/>            
            }
            <Button type="submit" fullWidth color="primary" disabled={!stripe || loading}>
                {loading ? "Ładowanie" : `Zapłać ${formatPrice(amount)}`}
            </Button>
        </form>
    );
}
 
export default CheckoutForm;