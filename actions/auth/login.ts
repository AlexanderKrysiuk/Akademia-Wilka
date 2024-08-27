"use server"

import { signIn as nextAuthSignIn } from "next-auth/react";
import { generateVerificationToken } from "@/data/token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/nodemailer";
import { LoginSchema } from "@/schemas/user";
import { z } from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Login = async (values: z.infer<typeof LoginSchema>, callBackUrl?: string | null) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Podano nieprawidłowe pola!" };
    }

    const email = validatedFields.data.email.toLowerCase();
    const password = validatedFields.data.password;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { success: false, message: "Podany e-mail nie istnieje!" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: true, message: "Wysłano e-mail weryfikacyjny!" };
    }

    // Poprawka: Używamy signIn z NextAuth
    const result = await nextAuthSignIn("credentials", {
        redirect: false,
        email,
        password,
    });

    if (result?.ok) {
        return { success: true, message: "Logowanie udane!" };
    } else {
        return { success: false, message: "Błąd logowania!" };
    }
};
