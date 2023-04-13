import { APIGatewayEvent, Context } from "aws-lambda";
import { validate } from "uuid";
import { findOneProduct, findOneProductPg } from "../service/product.service";
import { logger, sendResponse } from "../lib";

export const getProductById = async (
  event: APIGatewayEvent,
  context: Context
) => {
  logger(event, context);
  const productId = event.pathParameters?.productId as string;

  try {
    if (productId && !validate(productId)) {
      return sendResponse(
        {
          error: "Id should be a UUID",
        },
        400
      );
    }

    const product =
      process.env.USE_PG === "true"
        ? await findOneProductPg(productId)
        : await findOneProduct(productId);

    if (!product) {
      return sendResponse(
        {
          error: `Product with id ${productId} does not exist`,
        },
        404
      );
    }

    return sendResponse(product);
  } catch (error) {
    return sendResponse(
      {
        error: `Internal Sever Error occurred`,
      },
      500
    );
  }
};
