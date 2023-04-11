import {
  TransactWriteItemsCommandInput,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { client } from "./db";
import { products } from "../mock/products";
import { stocks } from "../mock/stocks";
import { Stock } from "../schema/stock.schema";

const initDatabase = async () => {
  for (let i = 0; i < products.length; i++) {
    const { id, price, title } = products[i];
    const { count, product_id } = stocks.find(
      (stock) => id === stock.product_id
    ) as Stock;

    const params: TransactWriteItemsCommandInput = {
      TransactItems: [
        {
          Put: {
            Item: marshall({
              id,
              price,
              title,
            }),
            TableName: "products",
          },
        },
        {
          Put: {
            Item: marshall({
              product_id,
              count,
            }),
            TableName: "stocks",
          },
        },
      ],
    };

    await client.send(new TransactWriteItemsCommand(params));
  }
};

initDatabase();
