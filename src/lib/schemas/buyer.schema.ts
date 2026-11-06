import z from "zod";

export const buyerSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    isBuyer: z.boolean().optional(),
    isEggSupplier: z.boolean().optional(),
});