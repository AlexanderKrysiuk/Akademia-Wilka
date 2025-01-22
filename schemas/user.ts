import * as z from 'zod'

const nameTemplate = z.string().optional()

const emailTemplate = z.string().email({ message: "Podaj poprawny Email!"})

const passwordTemplate = z.string()
    .min(1, { message: "Podaj hasło!"})

export const NewPasswordSchema = z.object({
    password: z.string()
        .min(8, "Hasło musi mieć co najmniej 8 znaków" )
        .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę" )
        .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę" )
        .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę" )
        .regex(/[\W_]/, "Hasło musi zawierać co najmniej jeden znak specjalny" ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hasła muszą być takie same",
})

export const EmailSchema = z.object({
    email: emailTemplate
})

export const RegisterSchema = z.object({
    name: nameTemplate,
    email: emailTemplate,
})

export const RegisterWithTermsSchema = z.object({
    name: nameTemplate,
    email: emailTemplate,
    terms: z.boolean().refine((value) => value === true, {
        message: "Musisz zaakceptować regulamin",
    }),
});

export const LoginSchema = z.object({
    email: emailTemplate,
    password: passwordTemplate
})

export const ResetSchema = z.object({
    email: emailTemplate
})

//export const NewPasswordSchema = z.object({
//    password: newPasswordTemplate
//})