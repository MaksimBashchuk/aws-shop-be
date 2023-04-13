import {
  TransactWriteItemsCommandInput,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { client } from "./db";
import { stocks, products } from "../mock";
import { Stock } from "../schema";

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
