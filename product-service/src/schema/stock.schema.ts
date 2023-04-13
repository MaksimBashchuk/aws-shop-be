import zod from "zod";

export const stockSchema = zod.object({
  product_id: zod.string().uuid(),
  count: zod.number().nonnegative(),
});

export type Stock = zod.infer<typeof stockSchema>;
