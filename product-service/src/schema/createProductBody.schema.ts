import zod from "zod";
import { productWithStockSchema } from "./product.schema";

export const createProductBodySchema = productWithStockSchema.omit({
  id: true,
});

export type CreateProductBody = zod.infer<typeof createProductBodySchema>;
