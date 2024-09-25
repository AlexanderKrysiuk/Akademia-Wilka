import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
    const { amount } = await request.json();

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "pln",
            automatic_payment_methods: { enabled: true }, // Włącz automatyczne metody płatności
        });
        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
