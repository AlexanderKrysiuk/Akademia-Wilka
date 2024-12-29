"use client"

import { checkIfUserHasCourse } from "@/actions/student/course";
import StartPage from "@/app/auth/start/page";
import { useCurrentUser } from "@/hooks/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLoader from "../page-loader";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurency";
import CourseCheckoutPage from "./course-checkout-page";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const CourseLandingPagePaymentElement = ({
    courseSlug,
    price
} : {
    courseSlug: string,
    price: number
}
) => {

    const user = useCurrentUser()
    const [loading, setLoading] = useState(true)
    const [hasCourse, setHasCourse] = useState(false)
    
    useEffect(()=>{
        checkIfUserHasCourse(user!.id, courseSlug)
        .then((data)=>setHasCourse(data))
        .catch((error)=>{
            toast.error(error)
        })
        .finally(()=>{
            setLoading(false)
            })
    }, [courseSlug, user])
            if (!user) return <StartPage/> 

    if (loading) return <PageLoader/>

    return (
        hasCourse ? (
            <Button>
                Przejdź do kurs
            </Button>
        ) : (
            <Card>
                <CardHeader>
                    Kurs kosztuje: {price}
                </CardHeader>
                <CardBody>
                    <Elements
                        stripe={stripePromise}
                        options={{
                            mode: "payment",
                            amount: convertToSubcurrency(price),
                            currency: "pln"
                        }}
                    >
                        <CourseCheckoutPage
                            amount={price}
                        />
                    </Elements>
                </CardBody>
            </Card>
        )
    );
}

export default CourseLandingPagePaymentElement; 
