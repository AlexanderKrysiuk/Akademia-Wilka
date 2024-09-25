import { auth } from '@/auth';
import { prisma } from '@/lib/prisma'; 
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request, { params }: { params: { courseID: string }}) {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: params.courseID,
                published: true
            }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }
        
        const user = await auth();
        let stripeCustomerId: string | null = null;

        if (user) {
            const purchase = await prisma.purchase.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.user.id,
                        courseId: params.courseID
                    }
                }
            });
            
            if (purchase) {
                return new NextResponse("Already purchased", { status: 400 });
            }

            let stripeCustomer = await prisma.stripeCustomer.findUnique({
                where: {
                    userId: user.user.id
                },
                select: {
                    stripeCustomerId: true
                }
            });
            
            if (!stripeCustomer) {
                const customer = await stripe.customers.create({
                    email: user.user.email
                });
                stripeCustomer = await prisma.stripeCustomer.create({
                    data: {
                        userId: user.user.id,
                        stripeCustomerId: customer.id
                    }
                });
            }
            stripeCustomerId = stripeCustomer.stripeCustomerId;
        }
        
        // Używamy price zamiast price_data
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price_data: {
                        currency: "pln",
                        product_data: {
                            name: course.title,
                        },
                        unit_amount: Math.round(course.price! * 100), // Kwota w groszach
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `${req.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
            customer: stripeCustomerId || undefined,
            metadata: {
                courseId: params.courseID,
                userId: user ? user.user.id : 'guest'
            }
        });

        return NextResponse.json({ clientSecret: session.client_secret });

    } catch (error) {
        console.error("[COURSE_ID_CHECKOUT_ERROR]: ", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
