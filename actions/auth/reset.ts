"use server";

import { generatePasswordResetToken } from "@/data/token";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/nodemailer";
import { ResetSchema } from "@/schemas/user";
import * as z from 'zod'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)

    if(!validatedFields.success) {
        return { success: false, message: "Podano nieprawidłowe pola!" }
    }

    const email = validatedFields.data.email;
    const existingUser = await getUserByEmail(email);

    

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono emaila!"}
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    );
    
    return { success: true, message: "Wysłano email resetujący!" }
}