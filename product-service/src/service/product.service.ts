import {
  ScanCommand,
  TransactGetItemsCommandInput,
  TransactGetItemsCommand,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
} from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Product } from "../schema/product.schema";
import { Stock } from "../schema/stock.schema";
import { client } from "../database/db";
import { CreateProductBody } from "../schema/createProductBody.schema";

const combineProduct = (product: Product, stock: Stock) => {
  if (product && stock) {
    return { ...product, count: stock.count };
  }
};

export const findAllProducts = async () => {
  const [productsOutput, stocksOutput] = await Promise.all([
    client.send(new ScanCommand({ TableName: "products" })),
    client.send(new ScanCommand({ TableName: "stocks" })),
  ]);

  if (productsOutput.Items && stocksOutput.Items) {
    const products = productsOutput.Items.map((item) => unmarshall(item));
    const stocks = stocksOutput.Items.map((item) => unmarshall(item));

    const result = products.map((product) => {
      const stock = stocks.find((stock) => product.id === stock.product_id);

      return combineProduct(product as Product, stock as Stock);
    });

    return result;
  }
};

export const findOneProduct = async (productId: string) => {
  const command: TransactGetItemsCommandInput = {
    TransactItems: [
      {
        Get: {
          TableName: "products",
          Key: marshall({
            id: productId,
          }),
        },
      },
      {
        Get: {
          TableName: "stocks",
          Key: marshall({
            product_id: productId,
          }),
        },
      },
    ],
  };

  const output = await client.send(new TransactGetItemsCommand(command));

  if (output.Responses) {
    const [product, stock] = output.Responses.map((response) => {
      if (response.Item) {
        return unmarshall(response.Item);
      }
    });

    return combineProduct(product as Product, stock as Stock);
  }
};

export const createNewProduct = async (
  createProductBody: CreateProductBody
) => {
  const id = v4();

  const command: TransactWriteItemsCommandInput = {
    TransactItems: [
      {
        Put: {
          TableName: "products",
          Item: marshall(
            {
              id: id,
              title: createProductBody.title,
              price: createProductBody.price,
              description: createProductBody.description,
            },
            { removeUndefinedValues: true }
          ),
        },
      },
      {
        Put: {
          TableName: "stocks",
          Item: marshall(
            {
              product_id: id,
              count: createProductBody.count,
            },
            { removeUndefinedValues: true }
          ),
        },
      },
    ],
  };

  await client.send(new TransactWriteItemsCommand(command));
  const createdProduct = await findOneProduct(id);
  return createdProduct;
};
