"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductStatus, ProductType } from "@prisma/client";


export const activateCourse = async(courseId:string) => {
    const session = await auth()
    const user = session?.user

    if (!user || !user.id) throw new Error("Niezalogowany");

    const activeOrderItem = await prisma.orderItem.findFirst({
        where: {
            userId: user.id,
            productId: courseId,
            productType: ProductType.Course,
            status: ProductStatus.Active,
        },
    });

    if (!activeOrderItem) {
        throw new Error("Nie znaleziono aktywnego kursu do aktywacji.");
    }

    // Aktualizacja statusu na "Used"
    await prisma.orderItem.update({
        where: {
            id: activeOrderItem.id,
        },
        data: {
            status: ProductStatus.Used,
        },
    });
}