"use server"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe" 
import bcrypt from "bcryptjs"
import { generateVerificationToken } from "@/data/token"
import { sendVerificationEmail } from "@/lib/nodemailer"

// Funkcja rejestrująca nowego uzytkownika i tworząca sesję Stripe
export async function POST(req: Request, { params } : { params: { courseID: string }}){
    try {
        const { email, name, password } = await req.json();
        
        // sprawdź czy kurs istnieje
        const course = await prisma.course.findUnique({
            where: { id: params.courseID, published:true }
        });

        if (!course) {
            return new NextResponse("Nie znaleziono kursu!", { status: 404} )
        }

        let user = await prisma.user.findUnique({ where: { email } })
        
        if (user) {
            const purchase = await prisma.purchase.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: course.id
                    }
                }
            })

            if (purchase) {
                return new NextResponse("Kurs jest juz zakupiony", {status: 400})
            }

            let stripeCustomer = await prisma.stripeCustomer.findUnique({
                where: { userId: user.id },
            })

            if (!stripeCustomer) {
                const customer = await stripe.customers.create({email})
                stripeCustomer = await prisma.stripeCustomer.create({
                    data: {
                        userId: user.id,
                        stripeCustomerId: customer.id
                    }
                })
            }

            const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
                {
                    quantity: 1,
                    price_data: {
                        currency: "pln",
                        product_data: { name: course.title },
                        unit_amount: Math.round(course.price! * 100)
                    }
                }
            ]

            const session = await stripe.checkout.sessions.create({
                customer: stripeCustomer.stripeCustomerId,
                line_items,
                mode: "payment",
                success_url: `http://localhost:3000/kurs/${course.slug}`,
                cancel_url: `http://localhost:3000/kurs/${course.slug}`,
                metadata: { courseId: course.id, userId: user.id }
            });

            return NextResponse.json({ url: session.url })
        } else {
            // jeśli uzytkownik nie istnieje, tworzymy nowego
            const hashedPassword = await bcrypt.hash(password, 11)
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword
                }
            })

            const verificationToken = await generateVerificationToken(email);
                await sendVerificationEmail(
                    verificationToken.email,
                    verificationToken.token
            )

            // utwórz klienta stripe dla nowego uzytkownika
            const customer = await stripe.customers.create({ email })
            const stripeCustomer = await prisma.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            })

            const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
                {
                    quantity: 1,
                    price_data: {
                        currency: "pln",
                        product_data: { name: course.title },
                        unit_amount: Math.round(course.price! * 100)
                    }
                }
            ]

            const session = await stripe.checkout.sessions.create({
                customer: stripeCustomer.stripeCustomerId,
                line_items,
                mode: "payment",
                success_url: `http://localhost:3000/kurs/${course.slug}`,
                cancel_url: `http://localhost:3000/kurs/${course.slug}`,
                metadata: { courseId: course.id, userId: user.id }
            })

            return NextResponse.json({ url: session.url })
        }
    } catch {
        return new NextResponse("Internal Error", { status: 500 })
    }
}








{/* 
import { auth } from "@/auth"
import { useCurrentUser } from "@/hooks/user"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { getUserByEmail } from "@/data/user"

export async function POST(
    req: Request,
    { params }: { params: { courseID: string }}
) {
    try {
        let user;
        const loggedUser = await auth()
        if (loggedUser && loggedUser.user.id) {
            user = loggedUser.user
        } else {
            const { searchParams } = new URL( req.url )
            const email = searchParams.get("email")
            if (!email) {
                return new NextResponse("Email jest wymagany", { status: 400 });
            }
            user = await getUserByEmail(email);
            if (!user) {
                return new NextResponse("Nie znaleziono użytkownika", { status: 404 });
            }
        }
        
        const course = await prisma.course.findUnique({
            where: {
                id: params.courseID,
                published: true
            }
        })
        
        if (!course) {
            return new NextResponse("Course not found", {status: 404})
        }
        
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.user.id,
                    courseId: params.courseID
                }
            }
        })
        
        if (purchase) {
            return new NextResponse("Already Purchased", {status: 400})
        }
        
        
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "pln",
                    product_data: {
                        name: course.title,
                    },
                    unit_amount: Math.round(course.price! * 100)
                }
            }
        ]
        
        let stripeCustomer = await prisma.stripeCustomer.findUnique({
            where: {
                userId: user.user.id
            },
            select: {
                stripeCustomerId: true
            }
        })
        
        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.user.email
            })
            stripeCustomer = await prisma.stripeCustomer.create({
                data: {
                    userId: user.user.id,
                    stripeCustomerId: customer.id
                }
            })
        }
        
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `http://localhost:3000/kurs/${course.slug}`,
            cancel_url: `http://localhost:3000/kurs/${course.slug}`,
            metadata: {
                courseId: course.id,
                userId: user.user.id,
            },
        })
        
        return NextResponse.json({ url: session.url})
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]:", error)
        return new NextResponse("Internal Error", {status: 500})
    } 
}
    */}