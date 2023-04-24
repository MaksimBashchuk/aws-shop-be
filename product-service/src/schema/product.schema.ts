import zod from "zod";
import { stockSchema } from "./stock.schema";

export const productSchema = zod.object({
  id: zod.string().uuid(),
  title: zod.string(),
  description: zod.string().optional(),
  price: zod
    .number()
    .or(zod.string().regex(/^\d*$/, "Invalid. Expect number or numeric string"))
    .transform((val) => +val),
});

export const productWithStockSchema = productSchema.merge(
  stockSchema.pick({ count: true })
);

export type Product = zod.infer<typeof productSchema>;
export type ProductWithStock = zod.infer<typeof productWithStockSchema>;
