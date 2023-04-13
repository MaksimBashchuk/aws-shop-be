import { Product, Stock } from "../schema";

export const initialQuery = `
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS products;

CREATE TABLE products (id UUID PRIMARY KEY, title VARCHAR(255) NOT NULL, price DECIMAL(10, 2) NOT NULL, description TEXT);
INSERT INTO products (id, title, price, description)
VALUES
	('5e790c72-bd44-484d-b72a-64265fd29513', 'Stray', 19.99, 'A cat adventure game'),
  ('0dcce7ec-36bf-4f5a-86ae-0a25207ab925', 'God of War Ragnarök', 69.99, 'A Norse mythology-inspired action game'),
  ('1aae587d-3188-4baf-acc7-c47db90379ad', 'The Last of Us Part I', 52.49, 'A post-apocalyptic survival game'),
  ('cae0ddbe-7023-4847-9fde-e82f04cf126c', 'Dead Space', 69.99, 'A sci-fi horror game'),
  ('77c54970-6158-43de-8568-802de1ee56c4', 'Hogwarts Legacy', 64.99, 'An open-world RPG set in the Harry Potter universe'),
  ('41436932-c5cf-4d3f-b060-b23b095e1c40', 'ELDEN RING', 49.99, 'A dark fantasy action RPG');

CREATE TABLE stocks (product_id UUID PRIMARY KEY NOT NULL, count INT NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id));
INSERT INTO stocks (product_id, count)
VALUES
	('5e790c72-bd44-484d-b72a-64265fd29513', 10),
  ('0dcce7ec-36bf-4f5a-86ae-0a25207ab925', 1),
  ('1aae587d-3188-4baf-acc7-c47db90379ad', 7),
  ('cae0ddbe-7023-4847-9fde-e82f04cf126c', 6),
  ('77c54970-6158-43de-8568-802de1ee56c4', 2),
  ('41436932-c5cf-4d3f-b060-b23b095e1c40', 4);
`;

export const getAllProductsQuery = () => ({
  name: "getAllProducts",
  text: `
    SELECT p.*, s.count FROM products p JOIN stocks s ON p.id = s.product_id;
  `,
});

export const getProductQuery = (id: string) => ({
  name: "getProduct",
  text: `
    SELECT p.*, s.count FROM products p JOIN stocks s ON p.id = s.product_id WHERE p.id = $1;
  `,
  values: [id],
});

export const createProductQuery = ({
  id,
  title,
  description,
  price,
}: Product) => ({
  name: "createProduct",
  text: `INSERT INTO products (id, title, description, price) VALUES ($1, $2, $3, $4);`,
  values: [id, title, description, price],
});

export const createStockQuery = ({ product_id, count }: Stock) => ({
  name: "createStock",
  text: `INSERT INTO stocks (product_id, count) VALUES ($1, $2);`,
  values: [product_id, count],
});
