import { APIGatewayEvent } from "aws-lambda";
import { findOneProduct } from "../service/product.service";

export const getProductById = async (event: APIGatewayEvent) => {
  const productId = +event.pathParameters?.productId;

  if (isNaN(productId)) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        errorMessage: "Bad Request: Id should be an integer",
      }),
    };
  }

  try {
    const product = await findOneProduct(productId);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        errorMessage: `Not Found: ${error}`,
      }),
    };
  }
};
