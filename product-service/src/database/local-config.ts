import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

export const localConfig: DynamoDBClientConfig = {
  region: "localhost",
  endpoint: "http://localhost:8000",
};
