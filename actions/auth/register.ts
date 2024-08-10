"use server";

import * as z from 'zod';
import { RegisterSchema } from '@/schemas/user';
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/data/user';
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from '@/data/token';
import { sendVerificationEmail } from '@/lib/nodemailer';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success){
        return { success: false, message: "Podane pola są nieprawidłowe" }
    }
    const name = validatedFields.data.name;
    const email = validatedFields.data.email.toLocaleLowerCase();
    const password = validatedFields.data.password

    const hashedPassword = await bcrypt.hash(password, 11);

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { success: false, message: "Email jest już w użyciu!" }
    }

    await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
        }
    })

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )
    return { success: true, message: "Wysłano email weryfikacyjny!"}
}