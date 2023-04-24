import { v4 } from "uuid";
import { CreateProductBody, Product, Stock } from "../schema";
import { products, stocks } from "../mock";

const combineProduct = (product: Product, stock: Stock) => {
  if (product && stock) {
    return { ...product, count: stock.count };
  }
};

export const findAllProducts = () => {
  return products.map((product) => {
    const stock = stocks.find((stock) => stock.product_id === product.id);
    return combineProduct(product, stock as Stock);
  });
};

export const findOneProduct = (productId: string) => {
  const product = products.find(
    (product) => product.id === productId
  ) as Product;
  const stock = stocks.find((stock) => stock.product_id === productId) as Stock;
  return combineProduct(product, stock);
};

export const createNewProduct = (createProductBody: CreateProductBody) => {
  const { count, price, title, description } = createProductBody;
  const id = v4();

  const newProduct: Product = { id, price, title, description };
  const newStock: Stock = { product_id: id, count };

  products.push(newProduct);
  stocks.push(newStock);

  return { id, ...createProductBody };
};
