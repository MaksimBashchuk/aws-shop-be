import { APIGatewayEvent, Context } from "aws-lambda";
import { logger, sendResponse } from "../lib";
import { findAllProducts, findAllProductsPg } from "../service/product.service";

export const getProductsList = async (
  event: APIGatewayEvent,
  context: Context
) => {
  logger(event, context);
  try {
    const products =
      process.env.USE_PG === "true"
        ? await findAllProductsPg()
        : await findAllProducts();

    return sendResponse(products);
  } catch (error) {
    return sendResponse(
      {
        error: `Internal Sever Error occurred`,
      },
      500
    );
  }
};
