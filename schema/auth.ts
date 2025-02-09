import { z } from "zod";
import { confirmPassword, email, name, newPassword } from "./templates";

export const RegisterSchema = z.object({
    name,
    email
})

export const NewPasswordSchema = z.object({
    newPassword,
    confirmPassword
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hasła muszą być takie same",
})
