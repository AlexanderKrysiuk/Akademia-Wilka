import * as z from 'zod'

export const name = z.string().optional()
export const email = z.string().email({ message: "Podaj poprawny e-mail" }).transform((val) => val.toLowerCase());
