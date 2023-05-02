import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import { getPolicy } from "../lib";

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event
) => {
  const token = event.authorizationToken;
  const resource = event.methodArn;
  const encodedCredentials = token.split(" ")[1];

  const buffer = Buffer.from(encodedCredentials, "base64");
  const [username, password] = buffer.toString("utf-8").split(":");

  const configuredPassword = process.env[username];
  const effect =
    configuredPassword && configuredPassword === password ? "Allow" : "Deny";

  const policy = getPolicy(username, effect, resource);
  return policy;
};
