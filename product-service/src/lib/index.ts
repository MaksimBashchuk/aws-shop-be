import { APIGatewayEvent, Context } from "aws-lambda";

export const sendResponse = (data?: any, statusCode: number = 200) => {
  const response: Record<string, unknown> = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  if (data) {
    response["body"] = JSON.stringify(data);
  }

  return response;
};

export const logger = (event: APIGatewayEvent, context: Context) => {
  console.group(`REQUEST - ${context.awsRequestId}`);
  console.log(`[${event.httpMethod}] - ${event.path}`);
  console.log(`[PATH_PARAMETERS] - ${JSON.stringify(event.pathParameters)}`);
  console.log(`[REQUEST_BODY] - ${event.body}`);
  console.groupEnd();
};
