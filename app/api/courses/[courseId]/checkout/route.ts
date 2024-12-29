import { checkIfUserHasCourse } from "@/actions/student/course"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(
    req: Request,
    { params } : { params: { courseId : string }}
) {
    try {
        const user = await auth()
        if (!user || !user.user.id || !user.user.email) {
            return new NextResponse("Unauthorized", {status:400})
        }
        const course = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                published: true
            }
        })
        if (!course) return new NextResponse("Course not found", {status:400})

        const hasCourse = await checkIfUserHasCourse(user.user.id, course.id)
        if (hasCourse) return new NextResponse("Course already purchased", {status:400})

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "pln",
                    product_data: {
                        name: course.title,
                        description: course.description || undefined
                    },
                    unit_amount: Math.round((course.price || 100)*100)
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
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/kursy/${course.slug}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
            metadata: {
                courseId: course.id,
                userId: user.user.id
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error("COURSE_ID_CHECKOUT",error)
        return new NextResponse("Internal Error", {status: 500})
    }
}