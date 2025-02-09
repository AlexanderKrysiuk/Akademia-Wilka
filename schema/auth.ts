import { z } from "zod";
import { confirmPassword, email, name, newPassword, password } from "./templates";

export const RegisterSchema = z.object({
    name,
    email
})

export const LoginSchema = z.object({
    email,
    password
})

export const NewPasswordSchema = z.object({
    newPassword,
    confirmPassword
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hasła muszą być takie same",
})
