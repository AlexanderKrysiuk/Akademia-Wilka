import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json()

        const paymentIntent = await stripe.paymentIntent.create({
            amount: amount,
            currency: "pln",
            automatic_payment_method: { enabled: true }
        })

        return NextResponse.json({ clientSecret: paymentIntent.clientSecret })
    } catch (error) {
        console.error("Internal Error", error)
        return NextResponse.json(
            { error: `Internal Server Error: ${error}`},
            { status: 500 }
        )
    }
}