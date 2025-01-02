"use server"

import { stripe } from "@/lib/stripe"
import { checkIfUserHasCourse, getPublishedCourseBySlug } from "../student/course"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { use } from "react"

const domain = process.env.NEXT_PUBLIC_APP_URL

export async function CreateCoursePaymentPage(slug:string) {

    const user = await auth()

    if (!user || !user.user.email) throw new Error("Nie znaleziono uzytkownika")

    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
            published: true
        }
    })
    if (!course || !course.published || !course.price) throw new Error("Kurs niedostępny")

    const userHasCourse = await checkIfUserHasCourse(course.id)
    if (userHasCourse) throw new Error("Posiadasz już ten kurs, zaloguj się")

    let stripeCustomer = await prisma.stripeCustomer.findUnique({
        where: { userId: user.user.id },
    })
    
    // Jeśli użytkownik nie ma przypisanego StripeCustomer, utwórz go
    if (!stripeCustomer) {
        // Tworzenie klienta w Stripe
        const customer = await stripe.customers.create({
            email: user.user.email, // Możesz użyć emaila z sesji lub z bazy danych
        })
        // Tworzenie rekordu StripeCustomer w bazie danych
        stripeCustomer = await prisma.stripeCustomer.create({
            data: {
                userId: user.user.id,
                stripeCustomerId: customer.id,
            },
        })
    }

    const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: "pln",
              product_data: {
                name: course.title,
                description: course.description || undefined,
                // Tylko jeśli imageUrl istnieje, dodajemy go do danych produktu
                ...(course.imageUrl && { images: [course.imageUrl] }),
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${domain}/kurs/${course.slug}`,
        cancel_url: `${domain}/kurs/${course.slug}`,
        metadata: {
            userId: user.user.id,   // Identyfikator użytkownika
            courseId: course.id,    // Identyfikator kursu
        },
    });
    
      return {
        props: {
          course,
          checkoutUrl: session.url,
        },
      };
}