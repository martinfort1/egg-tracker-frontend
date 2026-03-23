import { z } from "zod";

export const saleSchema = z.object({
  buyerId: z.string(),

  Extra: z.number(),
  N1: z.number(),
  N2: z.number(),
  N3: z.number(),
  N4: z.number(),

  ExtraPrice: z.number(),
  N1Price: z.number(),
  N2Price: z.number(),
  N3Price: z.number(),
  N4Price: z.number(),

  amountPaid: z.number().optional()
});