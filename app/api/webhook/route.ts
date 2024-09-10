import Stripe from "stripe";
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    
    console.log("SUCCESS")
    const body = await req.text()
    const signature = req.headers.get('Stripe-Signature') as string
    console.log("Headers:", req.headers);
    console.log("Body:", body);

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        return new NextResponse(`[WEBHOOK ERROR]: ${error}`, {status: 400})
    }

    const session = event.data.object as Stripe.Checkout.Session
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId

    console.log("EVENT TYPE:", event.type)
    if (event.type === 'checkout.session.completed') {
        if (!userId || !courseId) {
            return new NextResponse('Invalid session', {status: 400})
        }

        await prisma.purchase.create({
            data: {
                courseId: courseId,
                userId: userId
            }
        })
    } else {
        return new NextResponse("Invalid event", {status: 200})
    }

    return new NextResponse(null, { status: 200})
}