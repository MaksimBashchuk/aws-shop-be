import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { S3Event } from "aws-lambda";
import { Readable } from "stream";
import csv from "csv-parser";

const queueClient = new SQSClient({ region: process.env.REGION });
const client = new S3Client({ region: process.env.REGION });

export const importFileParser = async (event: S3Event) => {
  try {
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    const response = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );

    const readStream = response.Body as Readable;

    const parseData = () =>
      new Promise((res) => {
        readStream
          .pipe(csv())
          .on("data", (data) => {
            queueClient.send(
              new SendMessageCommand({
                QueueUrl: process.env.QUEUE_URL,
                MessageBody: JSON.stringify(data),
                DelaySeconds: 0,
              })
            );
          })
          .on("end", async () => {
            await moveFile(bucket, key);
            res(null);
          });
      });

    await parseData();
  } catch (error) {
    console.error(error);
  }
};

const moveFile = async (bucket: string, key: string) => {
  const newKey = key.replace("uploaded/", "parsed/");

  const deleteParams = { Bucket: bucket, Key: key };
  const copyParams = {
    Bucket: bucket,
    Key: newKey,
    CopySource: `${bucket}/${key}`,
  };

  await client.send(new CopyObjectCommand(copyParams));
  await client.send(new DeleteObjectCommand(deleteParams));
};
