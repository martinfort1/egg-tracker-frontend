import z from "zod";

export const buyerSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
})