"use server"

const domain = process.env.NEXT_PUBLIC_APP_URL

import { generateVerificationToken } from "@/data/token"
import { sendVerificationEmail } from "@/lib/nodemailer"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { ProductStatus, ProductType } from "@prisma/client"
import { redirect } from "next/navigation"
import Stripe from "stripe"

export async function CoursePaymentPage(courseId: string, email:string, name?:string) {
    
    // Pobierz dane kursu
    const course = await prisma.course.findUnique({
        where: { 
            id: courseId,
            published: true
        },
    })

    if (!course) {
        throw new Error("Kurs nie istnieje")
    }

    let user = await prisma.user.findUnique({
        where: { email: email }
    })

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                name: name
            }
        })
        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
    }

    const userHasCourse = await prisma.orderItem.findFirst({
        where: {
            userId: user.id,
            productId: courseId,
            productType: ProductType.Course,
            status: ProductStatus.Active || ProductStatus.Returned
        }
    })

    if (userHasCourse) throw new Error("Masz już ten kurs")

    // Przygotowanie produktów do płatności Stripe
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
            price_data: {
                currency: 'pln',
                product_data: {
                    name: course.title,
                    images: [course.imageUrl!],
                    description: "Kurs online",
                },
                unit_amount: course.price! * 100, // Cena w groszach
            },
            quantity: 1,
        }
    ]
    
    // Tworzymy klienta Stripe, jeśli nie istnieje
    let stripeCustomer = await prisma.stripeCustomer.findUnique({
        where: { userId: user.id },
    });

    if (!stripeCustomer) {
        // Tworzymy klienta w Stripe
        const customer = await stripe.customers.create({
            email: user.email,
        });

        // Tworzymy rekord StripeCustomer w bazie danych
        stripeCustomer = await prisma.stripeCustomer.create({
            data: {
                userId: user.id,
                stripeCustomerId: customer.id,
            },
        });
    }

    // Tworzenie sesji Stripe Checkout
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${domain}/kursy/${course.slug}`,
        cancel_url: `${domain}/kursy/${course.slug}`,
        customer_email: email,
        metadata: {
            userId: user.id,
            courseId: courseId,
            price: Math.round(course.price! * 100)
        },
    })

    if (!session || !session.url) throw new Error("Nie udało się stworzyć sesji płatności.");
    redirect(session.url)
}