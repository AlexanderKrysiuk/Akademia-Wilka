import { z } from "zod";
import { email, name } from "./templates";

export const RegisterSchema = z.object({
    name,
    email
})