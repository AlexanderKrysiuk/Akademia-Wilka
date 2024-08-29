"use server"

import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/token";
import { sendVerificationEmail } from "@/lib/nodemailer";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas/user";
import * as z from 'zod';
import { use } from "react";

export const checkVerificationEmail = async (values: z.infer<typeof LoginSchema>) => {
    const email = values.email.toLowerCase();

    // Pobierz użytkownika z bazy danych
    const user = await getUserByEmail(email);

    if (!user || !user.email ||!user.password) {
        throw new Error("Podany e-mail nie istnieje!");
    }

    if (!user.emailVerified) {
        // Wyślij e-mail weryfikacyjny, jeśli e-mail nie jest zweryfikowany
        const verificationToken = await generateVerificationToken(user.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { message: "Wysłano e-mail weryfikacyjny!" }; // Rzucamy wyjątek, aby informować klienta
    }

    // W przypadku zweryfikowanego e-maila
    return;
};