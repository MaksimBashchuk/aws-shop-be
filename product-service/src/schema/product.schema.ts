import zod from "zod";

export const productSchema = zod.object({
  id: zod.string().uuid(),
  title: zod.string(),
  description: zod.string().optional(),
  price: zod.number(),
});

export type Product = zod.infer<typeof productSchema>;
