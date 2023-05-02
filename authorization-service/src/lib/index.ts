import { APIGatewayAuthorizerResult } from "aws-lambda";

export const getPolicy = (
  user: string,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult => ({
  principalId: user,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
