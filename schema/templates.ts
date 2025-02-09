import * as z from 'zod'

export const name = z.string().optional()
export const email = z.string().email({ message: "Podaj poprawny e-mail" }).transform((val) => val.toLowerCase());
export const newPassword = z.string()
.min(8, "Hasło musi mieć co najmniej 8 znaków" )
.regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę" )
.regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę" )
.regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę" )
.regex(/[\W_]/, "Hasło musi zawierać co najmniej jeden znak specjalny" )
export const confirmPassword = z.string()
export const password = z.string().min(1)