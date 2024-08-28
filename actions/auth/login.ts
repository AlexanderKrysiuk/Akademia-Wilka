{/* 
"use client"
// utils/handleLogin.ts

import { getUserByEmail, getUserRolesByUserID } from "@/data/user";
import { generateVerificationToken } from "@/data/token";
import { sendVerificationEmail } from "@/lib/nodemailer";
import bcrypt from 'bcryptjs';
import { signIn } from "next-auth/react";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

export const login = async (values: { email: string; password: string }) => {
    const router = useRouter();
    const email = values.email.toLowerCase();
    const password = values.password;
    
    try {
        // Pobierz użytkownika z bazy danych
        const user = await getUserByEmail(email);
        
        if (!user || !user.password) {
            toast.error("Podany e-mail nie istnieje!");
            return;
        }
        
        if (!user.emailVerified) {
            // Wyślij e-mail weryfikacyjny, jeśli e-mail nie jest zweryfikowany
            const verificationToken = await generateVerificationToken(user.email);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
            toast.success("Wysłano e-mail weryfikacyjny!");
            return;
        }
        
        // Sprawdź hasło
        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordsMatch) {
            toast.error("Błąd logowania!");
            return;
        }
        
        // Jeżeli hasło jest poprawne, zaloguj użytkownika
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        
        if (result?.ok && result?.url) {
            toast.success("Logowanie udane!");
            router.push(result.url);
        } else {
            toast.error("Błąd logowania!");
        }
    } catch (error) {
        toast.error("Wystąpił błąd podczas logowania.");
    }
};



*/}



{/* 
"use server"

import { getUserByEmail, getUserRolesByUserID } from "@/data/user";
import { generateVerificationToken } from "@/data/token";
import { sendVerificationEmail } from "@/lib/nodemailer";
import { signIn } from "next-auth/react";
import { LoginSchema } from "@/schemas/user";
import * as z from 'zod'

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)
    
    if (!validatedFields.success) {
        throw new Error("Podano nieprawidłowe pola!")
    }
    
    const email = validatedFields.data.email.toLowerCase()
    const password = validatedFields.data.password
    
    const user = await getUserByEmail(email.toLowerCase());
    if (!user || !user.email || !user.password) {
        throw new Error("Podany e-mail nie istnieje!");
    }
    
    if (!user.emailVerified) {
        const verificationToken = await generateVerificationToken(user.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { redirect: false, message: "Wysłano e-mail weryfikacyjny!" };
    }
    
    // Przypadek, gdy e-mail jest zweryfikowany
    const result = await signIn("credentials", {
        redirect: true,
        email,
        password,
    });
    
    if (result?.url) {
        return { redirect: true, url: result.url };
    } else {
        throw new Error("Błąd logowania!");
    }
};



*/}


import { signIn } from "@/auth"
import { generateVerificationToken } from "@/data/token"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/nodemailer"
import { LoginSchema } from "@/schemas/user"
import { z } from "zod"

export const Login = async (values: z.infer<typeof LoginSchema>, callBackUrl?: string | null) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        throw new Error("Podano nieprawidłowe pola!")
    }
    
    const email = validatedFields.data.email.toLowerCase()
    const password = validatedFields.data.password
    const user = await getUserByEmail(email)
    
    if (!user || !user.email || !user.password) {
        return { success: false, message: "Podany e-mail nie istnieje!"}
    }
    
    if (!user.emailVerified) {
        const verificationToken = await generateVerificationToken(user.email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        return { success: true, message: "Wysłano e-mail weryfikacyjny!"}
    } 
}