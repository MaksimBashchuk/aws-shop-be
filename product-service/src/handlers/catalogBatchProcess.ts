import { SQSEvent } from "aws-lambda";
import { SNSClient, PublishBatchCommand } from "@aws-sdk/client-sns";
import { v4 } from "uuid";
import { createProductBodySchema } from "../schema";
import { createBatchProducts } from "../service/product.service";

const topicClient = new SNSClient({ region: process.env.REGION });

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const products = event.Records.map((record) => {
      const body = JSON.parse(record.body);
      const parsedBody = createProductBodySchema.safeParse(body);

      if (!parsedBody.success) {
        return {
          success: parsedBody.success,
          error: parsedBody.error.flatten().fieldErrors,
          data: body,
        };
      }

      return parsedBody;
    });

    const successfullyParsed = products
      .filter((product) => product.success)
      .map((product) => product.data);

    if (successfullyParsed.length) {
      await createBatchProducts(successfullyParsed);
    }

    const messages = products.map((product) => {
      const status = product.success
        ? "Product successfully created"
        : "Failed to create product";

      const content: Record<string, any> = {
        status,
        data: product.data,
      };

      if (!product.success) {
        content["error"] = product.error;
      }

      return {
        Id: v4(),
        Message: JSON.stringify(content),
        Subject: "Create Product",
      };
    });

    const input = {
      TopicArn: process.env.SNS_TOPIC,
      PublishBatchRequestEntries: messages,
    };

    await topicClient.send(new PublishBatchCommand(input));
  } catch (error) {
    console.error(error);
  }
};
