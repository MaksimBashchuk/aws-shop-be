import { FromSchema } from "json-schema-to-ts";

export const productSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    count: { type: "integer" },
  },
  required: ["id", "title", "price", "count"],
} as const;

export type Product = FromSchema<typeof productSchema>;
