import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { ProductStatus, ProductType } from '@prisma/client'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get("Stripe-Signature") as string

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`WEBHOOK ERROR: ${error.message}`, {status: 400})
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId
    const totalAmount = session.amount_total
    const currency = session.currency

    if (event.type === 'checkout.session.completed') {
        if (!userId || !courseId || !totalAmount || !currency) {
            return new NextResponse("Invalid session", { status: 400 })
        }

        try {
            // Tworzenie zakupu
            const purchase = await prisma.purchase.create({
                data: {
                    stripeSessionId: session.id,
                    userId: userId, // Powiązanie zakupu z użytkownikiem
                    totalAmount: totalAmount, // Kwota zakupu
                    currency: currency, // Waluta
                    status: 'Paid', // Zmieniamy status na 'PAID' po zakończeniu płatności
                }
            })

            // Przetwarzanie zakupionych produktów (np. kursu)
            const purchasedProduct = await prisma.purchasedProducts.create({
                data: {
                    purchaseId: purchase.id, // Powiązanie z zakupem
                    productId: courseId, // Id kursu
                    productType: ProductType.Course, // Typ produktu
                    userId: userId, // Użytkownik przypisany do produktu
                    status: ProductStatus.Used, // Status aktywny
                    assignedAt: new Date(), // Data przypisania
                }
            })

            const lessons = await prisma.lesson.findMany({
                where: {
                    chapter: {
                        courseId: courseId
                    }
                }
            })

            const userProgressEntries = lessons.map((lesson)=>({
                userId: userId,
                lessonId: lesson.id,
                completed: false,
            }))

            await prisma.userCourseProgress.createMany({
                data: userProgressEntries
            })

            console.log(`Zakup pomyślnie zapisany dla użytkownika ${userId}, kurs: ${courseId}`)

        } catch (error: any) {
            console.error('Błąd podczas zapisywania zakupu:', error.message)
            return new NextResponse(`Error saving purchase: ${error.message}`, { status: 500 })
        }
    } else {
        return new NextResponse('Invalid event', {status:400})
    }

    return new NextResponse("Success", {status:200})
}
