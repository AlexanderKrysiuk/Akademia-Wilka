import { auth } from "@/auth"
import { useCurrentUser } from "@/hooks/user"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"

export async function POST(
    req: Request,
    { params }: { params: { courseID: string }}
) {
    try {
        const user = await auth()
        if (!user || !user.user.id) {
            return new NextResponse("Nieautoryzowany", {status: 401})
        }
        const course = await prisma.course.findUnique({
            where: {
                id: params.courseID,
                published: true
            }
        })

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

        if (!course) {
            return new NextResponse("Course not found", {status: 404})
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
                userId: user.user.id
            }
        })

        return NextResponse.json({ url: session.url})
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]:", error)
        return new NextResponse("Internal Error", {status: 500})
    } 
}