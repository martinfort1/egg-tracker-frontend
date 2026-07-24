import { z } from "zod";

export const orderSchema = z.object({
  buyerId: z.string().min(1),

  date: z.string(),

  Extra: z.number().min(0),
  N1: z.number().min(0),
  N2: z.number().min(0),
  N3: z.number().min(0),
  N4: z.number().min(0),

  ExtraPrice: z.number().min(0),
  N1Price: z.number().min(0),
  N2Price: z.number().min(0),
  N3Price: z.number().min(0),
  N4Price: z.number().min(0),

  recurring: z.boolean(),

  recurringDays: z.array(z.string()),
}).superRefine((data, ctx) => {
  if (data.recurring && data.recurringDays.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select at least one day",
      path: ["recurringDays"],
    });
  }
});