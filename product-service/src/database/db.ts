import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { localConfig } from "./local-config";

const config = process.env.IS_OFFLINE ? localConfig : {};

export const client = new DynamoDBClient(config);
