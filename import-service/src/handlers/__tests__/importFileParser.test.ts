import { importFileParser } from "../importFileParser";
import { S3Event } from "aws-lambda";
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn(),
  GetObjectCommand: jest.fn(),
  CopyObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

const mockSend = jest.fn();

describe("[importFileParser]", () => {
  const mockEvent = {
    Records: [
      {
        s3: {
          bucket: {
            name: "test-bucket",
          },
          object: {
            key: "uploaded/test.csv",
          },
        },
      },
    ],
  } as S3Event;

  const mockResponse = {
    Body: Readable.from("title,data\nTEST_1,TEST_2\nTEST_3,TEST_4"),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should parse CSV file and move it to parsed folder", async () => {
    S3Client.prototype.send = mockSend.mockResolvedValue(mockResponse);

    await importFileParser(mockEvent);

    expect(mockSend).toHaveBeenCalledTimes(3);

    expect(mockSend).toHaveBeenCalledWith(expect.any(GetObjectCommand));
    expect(jest.mocked(GetObjectCommand)).toHaveBeenCalledWith({
      Bucket: "test-bucket",
      Key: "uploaded/test.csv",
    });

    expect(mockSend).toHaveBeenCalledWith(expect.any(CopyObjectCommand));
    expect(jest.mocked(CopyObjectCommand)).toHaveBeenCalledWith({
      Bucket: "test-bucket",
      Key: "parsed/test.csv",
      CopySource: "test-bucket/uploaded/test.csv",
    });

    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
    expect(jest.mocked(DeleteObjectCommand)).toHaveBeenCalledWith({
      Bucket: "test-bucket",
      Key: "uploaded/test.csv",
    });
  });

  it("should log error in case of failing", async () => {
    const mockError = new Error("test error");
    console.error = jest.fn();
    S3Client.prototype.send = mockSend.mockRejectedValueOnce(mockError);

    await importFileParser(mockEvent);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
