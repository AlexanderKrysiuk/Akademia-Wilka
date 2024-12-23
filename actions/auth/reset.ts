"use server";

import { generatePasswordResetToken } from "@/data/token";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/nodemailer";
import { ResetSchema } from "@/schemas/user";
import * as z from 'zod'
import { sendNewVerificationEmail } from "./new-verification";

export async function reset (data: z.infer<typeof ResetSchema>) {
    const { email } = data;
    const existingUser = await getUserByEmail(email.toLowerCase())

    if (!existingUser) {
        throw new Error("Nie znaleziono użytkownika")
    }

    if (!existingUser.emailVerified || !existingUser.password) {
        await sendNewVerificationEmail(existingUser.email)
        throw new Error("Konto nie zostało zweryfikowane! Wysłano e-mail weryfikacyjny")
    }
      

    const passwordResetToken = await generatePasswordResetToken(email.toLowerCase())
    await sendPasswordResetEmail(
        passwordResetToken.email.toLowerCase(),
        passwordResetToken.token,
    );
}


{/* 
export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)
    
    if(!validatedFields.success) {
        return { success: false, message: "Podano nieprawidłowe pola!" }
    }
    
    const email = validatedFields.data.email.toLowerCase();
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
*/}