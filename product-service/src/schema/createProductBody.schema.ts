import zod from "zod";
import { productSchema } from "./product.schema";
import { stockSchema } from "./stock.schema";

export const createProductBodySchema = productSchema
  .omit({ id: true })
  .merge(stockSchema.pick({ count: true }));

export type CreateProductBody = zod.infer<typeof createProductBodySchema>;
