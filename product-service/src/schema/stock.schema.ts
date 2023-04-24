import zod from "zod";

export const stockSchema = zod.object({
  product_id: zod.string().uuid(),
  count: zod
    .number()
    .nonnegative()
    .or(zod.string().regex(/^\d*$/, "Invalid. Expect number or numeric string"))
    .transform((val) => +val),
});

export type Stock = zod.infer<typeof stockSchema>;
