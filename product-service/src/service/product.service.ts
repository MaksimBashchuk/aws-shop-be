import { Product } from "../schema/product.schema";
import { products } from "../mock";

export const findAllProducts = async () => {
  return new Promise<Product[]>((res) => {
    res(products);
  });
};

export const findOneProduct = async (productId: number): Promise<Product> => {
  return new Promise((res, rej) => {
    const product = products.find((product) => product.id === productId);

    product ? res(product) : rej(`Product with id ${productId} does not exist`);
  });
};
