import { catalogBatchProcess } from "../catalogBatchProcess";
import { SQSEvent } from "aws-lambda";
import { SNSClient, PublishBatchCommand } from "@aws-sdk/client-sns";
import { createBatchProducts } from "../../service/product.service";

jest.mock("@aws-sdk/client-sns", () => ({
  SNSClient: jest.fn(),
  PublishBatchCommand: jest.fn(),
}));

jest.mock("../../service/product.service", () => ({
  createBatchProducts: jest.fn(),
}));

const mockSend = jest.fn();

describe("[catalogBatchProcess]", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockEvent = {
    Records: [
      {
        body: JSON.stringify({
          title: "test7",
          description: "",
          price: "23",
          count: "7",
        }),
      },
      {
        body: JSON.stringify({
          title: "test8",
          description: "",
          price: "asd",
          count: "8",
        }),
      },
    ],
  } as SQSEvent;

  it("should create products based on successfully parsed messages", async () => {
    await catalogBatchProcess(mockEvent);
    expect(jest.mocked(createBatchProducts)).toHaveBeenCalledWith([
      {
        title: "test7",
        description: "",
        price: 23,
        count: 7,
      },
    ]);
  });

  it("should send message when product created", async () => {
    SNSClient.prototype.send = mockSend.mockResolvedValue("");

    await catalogBatchProcess(mockEvent);

    expect(mockSend).toHaveBeenCalledWith(expect.any(PublishBatchCommand));
    expect(jest.mocked(PublishBatchCommand)).toHaveBeenCalledWith({
      PublishBatchRequestEntries: expect.arrayContaining([
        expect.objectContaining({
          Message: expect.stringContaining(
            'status":"Product successfully created'
          ),
        }),
      ]),
      TopicArn: undefined,
    });
  });

  it("should send message in case of create product command failed", async () => {
    SNSClient.prototype.send = mockSend.mockResolvedValue("");

    await catalogBatchProcess(mockEvent);

    expect(mockSend).toHaveBeenCalledWith(expect.any(PublishBatchCommand));
    expect(jest.mocked(PublishBatchCommand)).toHaveBeenCalledWith({
      PublishBatchRequestEntries: expect.arrayContaining([
        expect.objectContaining({
          Message: expect.stringContaining('status":"Failed to create product'),
        }),
      ]),
      TopicArn: undefined,
    });
    expect(jest.mocked(PublishBatchCommand)).toHaveBeenCalledWith({
      PublishBatchRequestEntries: expect.arrayContaining([
        expect.objectContaining({
          Message: expect.stringContaining("error"),
        }),
      ]),
      TopicArn: undefined,
    });
  });

  it("should log error in case of failing", async () => {
    const mockError = new Error("test error");
    console.error = jest.fn();
    SNSClient.prototype.send = mockSend.mockRejectedValueOnce(mockError);

    await catalogBatchProcess(mockEvent);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
