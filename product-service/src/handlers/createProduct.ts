import { APIGatewayEvent, Context } from "aws-lambda";
import { ZodError } from "zod";
import { createNewProduct } from "../service/product.service";
import {
  CreateProductBody,
  createProductBodySchema,
} from "../schema/createProductBody.schema";
import { logger, sendResponse } from "../lib";

export const createProduct = async (
  event: APIGatewayEvent,
  context: Context
) => {
  logger(event, context);
  try {
    if (event.body) {
      const body = JSON.parse(event.body);
      const parsedBody = createProductBodySchema.parse(body);
      const result = await createNewProduct(parsedBody as CreateProductBody);
      return sendResponse(result, 201);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return sendResponse(
        {
          error: `Body should be in correct JSON format`,
        },
        400
      );
    }
    if (error instanceof ZodError) {
      const { fieldErrors } = error.flatten();
      return sendResponse({ error: "Validation failed", fieldErrors }, 400);
    }
    return sendResponse(
      {
        error: `Internal Sever Error occurred`,
      },
      500
    );
  }
};
