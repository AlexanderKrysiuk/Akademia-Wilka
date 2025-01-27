import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { PaymentStatus, ProductStatus, ProductType } from '@prisma/client';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
    }

    // Obsługujemy tylko typ `checkout.session.completed`
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const totalAmount = session.amount_total;
        const currency = session.currency;
        // Odczytujemy line_items
        const productMetadata = JSON.parse(session.metadata?.products || '[]'); // Produkty przekazywane w metadanych

        if (!userId || !totalAmount || !currency || !productMetadata) {
            return new NextResponse('Invalid session data', { status: 400 });
        }

        try {
            // Tworzenie zakupu
            const purchase = await prisma.purchase.create({
                data: {
                    stripeSessionId: session.id,
                    userId,
                    totalAmount,
                    currency,
                    status: PaymentStatus.Paid,
                },
            });

            for (const product of productMetadata) {
                await prisma.orderItem.create({
                    data: {
                        purchaseId: purchase.id,
                        productId: product.id,
                        productType: product.type,
                        ownerId: userId,
                        userId: userId,
                        price: product.price
                    }
                })
            }

            console.log(`Zakup pomyślnie zapisany dla użytkownika ${userId}, kursy: ${productMetadata}`);
        } catch (error: any) {
            console.error('Błąd podczas zapisywania zakupu:', error.message);
            return new NextResponse(`Error saving purchase: ${error.message}`, { status: 500 });
        }
    } else {
        return new NextResponse('Unhandled event type', { status: 400 });
    }

    return new NextResponse('Success', { status: 200 });
}
