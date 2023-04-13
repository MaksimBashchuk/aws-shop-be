//@ts-nocheck
import { findAllProducts } from "../../service/product.service";
import { getProductsList } from "../getProductsList";
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

const mockedService = jest.mocked(findAllProducts);

describe.skip("getProductsList - /products", () => {
  it("Should return list of all products", async () => {
    mockedService.mockImplementation(async () => mockData);
    const res = await getProductsList();

    expect(res.statusCode).toBe(200);

    const jsonData = JSON.stringify(mockData);
    expect(res.body).toBe(jsonData);
  });
});
