import { findOneProduct } from "../../service/product.service";
import { getProductById } from "../getProductById";
jest.mock("../../service/product.service");

const mockData = [
  {
    title: "test",
    id: 12,
    price: 33.33,
    count: 3,
  },
  {
    title: "test2",
    id: 13,
    price: 11,
    count: 2,
  },
];

const mockedService = jest.mocked(findOneProduct);
const generateApiEvent: any = (id: string) => ({
  pathParameters: {
    productId: id,
  },
});

describe("getProductById - /products/{productId}", () => {
  it("should return product with requested id", async () => {
    mockedService.mockImplementationOnce(async () => mockData[1]);
    const apiGatewayEvent = generateApiEvent("13");

    const res = await getProductById(apiGatewayEvent);

    expect(res.statusCode).toBe(200);

    const jsonData = JSON.stringify(mockData[1]);
    expect(res.body).toBe(jsonData);
  });

  it("should return bad request error in case of invalid id type", async () => {
    const apiGatewayEvent = generateApiEvent("test");

    const res = await getProductById(apiGatewayEvent);

    expect(res.statusCode).toBe(400);

    const jsonData = JSON.stringify({
      errorMessage: "Bad Request: Id should be an integer",
    });
    expect(res.body).toBe(jsonData);
  });

  it("should return 404 error if product requested id not found", async () => {
    mockedService.mockImplementationOnce(async () =>
      Promise.reject(`Product with id 56 does not exist`)
    );
    const apiGatewayEvent = generateApiEvent("56");

    const res = await getProductById(apiGatewayEvent);

    expect(res.statusCode).toBe(404);

    const jsonData = JSON.stringify({
      errorMessage: `Not Found: Product with id 56 does not exist`,
    });

    expect(res.body).toBe(jsonData);
  });
});
