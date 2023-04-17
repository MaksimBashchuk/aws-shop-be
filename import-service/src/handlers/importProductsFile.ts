import { S3Client } from "@aws-sdk/client-s3";
import { APIGatewayEvent } from "aws-lambda";
import { sendResponse } from "../lib";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const client = new S3Client({ region: process.env.REGION });

export const importProductsFile = async (event: APIGatewayEvent) => {
  const bucketName = process.env.BUCKET_NAME || "";
  const fileName = event?.queryStringParameters?.name;

  if (!fileName?.includes(".csv")) {
    return sendResponse(
      {
        error: `Wrong file type. Only '.csv' files allowed`,
      },
      400
    );
  }

  try {
    const presignedUrl = await createPresignedPost(client, {
      Bucket: bucketName,
      Key: `uploaded/${fileName}`,
      Expires: 300,
    });

    return sendResponse(presignedUrl);
  } catch (error) {
    console.error(error);
    return sendResponse({ error: "Internal server error ocurred" }, 500);
  }
};
