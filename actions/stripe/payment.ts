"use server"

import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { generateVerificationToken } from "@/data/token"
import { sendVerificationEmail } from "@/lib/nodemailer"
import { ProductStatus, ProductType } from "@prisma/client"
import { redirect } from "next/navigation"

const domain = process.env.NEXT_PUBLIC_APP_URL

// Typ danych dla checkoutu
export type CheckoutData = {
    name?: string;
    email: string;
    terms: boolean;
    cartItems: { id: string; type: string }[];  // Typ danych koszyka
};

export async function CreatePaymentPage(data: CheckoutData) {
    const { name, email, terms, cartItems } = data

    // Sprawdzamy, czy użytkownik zaakceptował regulamin
    if (!terms) throw new Error("Musisz zakceptować regulamin")

    // Filtrujemy kartę na elementy, które są typu "Course"
    const courseItems = cartItems.filter(item => item.type === "Course");

    // Jeśli mamy kursy w koszyku, to wyszukujemy je w bazie danych
    if (courseItems.length > 0) {
        // Pobieramy kursy z bazy danych na podstawie ID
        const courseIds = courseItems.map(item => item.id); // Identyfikatory kursów
        const courses = await prisma.course.findMany({
            where: {
                id: { in: courseIds }, // Filtrujemy kursy po ich ID
                published: true, // Kurs musi być opublikowany
                price: { gt: 0 }, // Cena kursu musi być większa niż 0
            },
        });
        // Jeśli nie ma kursów spełniających te warunki
        if (courses.length === 0) {
            throw new Error("Brak kursów spełniających warunki.");
        }
    }

    let user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) {
        user = await prisma.user.create({
            data: { 
                email: email,
                name: name
            }
        })
    }

    // Sprawdzamy, które kursy użytkownik już posiada
    const userHasCourses = await prisma.orderItem.findMany({
        where: {
            userId: user.id,
            productId: { in: cartItems.map(item => item.id) },
            productType: ProductType.Course, // Tylko kursy
            status: { in: [ProductStatus.Active, ProductStatus.Used] }, // Użytkownik musi mieć aktywne lub użyte kursy
        },
    });

    // Usuwamy kursy, które użytkownik już posiada
    const validCartItems = cartItems.filter(item =>
        !userHasCourses.some(course => course.productId === item.id)
    );

    if (validCartItems.length === 0) {
        throw new Error("Wszystkie wybrane kursy zostały już zakupione.");
    }

    // Wyszukiwanie dostępnych kursów w bazie danych
    const availableCourses = await prisma.course.findMany({
        where: {
            id: { in: validCartItems.map(item => item.id) },
            price: { gt: 0 }, // Cena > 0
            published: true, // Tylko opublikowane kursy
        },
    });

    // Tworzymy sesję Stripe Checkout
    const lineItems = availableCourses.map(course => ({
        price_data: {
            currency: "pln",
            product_data: {
                name: course.title,
                description: course.description || undefined,
                ...(course.imageUrl && { images: [course.imageUrl] }),
            },
            unit_amount: Math.round(course.price! * 100), // Cena w groszach
        },
        quantity: 1,
    }));

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
        customer: stripeCustomer.stripeCustomerId,
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.DOMAIN}/kursy/success`, // Możesz dostosować URL sukcesu
        cancel_url: `${process.env.DOMAIN}/kursy/cancel`, // Możesz dostosować URL anulowania
        metadata: {
            userId: user.id, // Identyfikator użytkownika
            courseIds: availableCourses.map(course => course.id).join(", "), // Identyfikatory kursów
        },
    });

    if (!session || !session.url) throw new Error("Nie udało się stworzyć sesji płatności.");


    redirect(session.url)

}