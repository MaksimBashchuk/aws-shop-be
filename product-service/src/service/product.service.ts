import {
  ScanCommand,
  TransactGetItemsCommandInput,
  TransactGetItemsCommand,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
} from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { Pool } from "pg";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Stock, Product, CreateProductBody, ProductWithStock } from "../schema";
import { client } from "../database/db";
import {
  createProductQuery,
  createStockQuery,
  getAllProductsQuery,
  getProductQuery,
} from "../database/queries";

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const combineProduct = (product: Product, stock: Stock) => {
  if (product && stock) {
    return { ...product, count: stock.count };
  }
};

export const findAllProductsPg = async () => {
  const pgClient = await pool.connect();

  try {
    await pgClient.query("BEGIN");
    const result = await pgClient.query<ProductWithStock>(
      getAllProductsQuery()
    );
    await pgClient.query("COMMIT");
    return result.rows;
  } catch (e) {
    await pgClient.query("ROLLBACK");
    throw e;
  } finally {
    pgClient.release();
  }
};

export const findAllProducts = async () => {
  const [productsOutput, stocksOutput] = await Promise.all([
    client.send(
      new ScanCommand({ TableName: process.env.PRODUCTS_TABLE_NAME })
    ),
    client.send(new ScanCommand({ TableName: process.env.STOCKS_TABLE_NAME })),
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

export const findOneProductPg = async (productId: string) => {
  const pgClient = await pool.connect();

  try {
    await pgClient.query("BEGIN");
    const result = await pgClient.query<ProductWithStock>(
      getProductQuery(productId)
    );
    await pgClient.query("COMMIT");
    return result.rows[0];
  } catch (e) {
    await pgClient.query("ROLLBACK");
    throw e;
  } finally {
    pgClient.release();
  }
};

export const findOneProduct = async (productId: string) => {
  const command: TransactGetItemsCommandInput = {
    TransactItems: [
      {
        Get: {
          TableName: process.env.PRODUCTS_TABLE_NAME,
          Key: marshall({
            id: productId,
          }),
        },
      },
      {
        Get: {
          TableName: process.env.STOCKS_TABLE_NAME,
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

export const createNewProductPg = async ({
  title,
  description,
  price,
  count,
}: CreateProductBody) => {
  const id = v4();
  const pgClient = await pool.connect();

  try {
    await pgClient.query("BEGIN");
    await pgClient.query(createProductQuery({ id, title, description, price }));
    await pgClient.query(createStockQuery({ product_id: id, count }));
    const result = await pgClient.query<ProductWithStock>(getProductQuery(id));
    await pgClient.query("COMMIT");
    return result.rows[0];
  } catch (e) {
    await pgClient.query("ROLLBACK");
    throw e;
  } finally {
    pgClient.release();
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
          TableName: process.env.PRODUCTS_TABLE_NAME,
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
          TableName: process.env.STOCKS_TABLE_NAME,
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
