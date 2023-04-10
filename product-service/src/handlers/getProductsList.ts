import { findAllProducts } from "../service/product.service";

export const getProductsList = async () => {
  const products = await findAllProducts();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(products),
  };
};
