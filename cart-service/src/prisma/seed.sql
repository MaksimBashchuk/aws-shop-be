INSERT INTO public."User"(
	id, name, email, password)
	VALUES ("TEST_USER", "TEST_USER", , "TEST_PASSWORD"), ("MaksimBashchuk", "MaksimBashchuk", , "TEST_PASSWORD");

INSERT INTO public."Cart"(
	id, user_id, "createdAt", "updatedAt", status)
	VALUES
    ("eefab14b-1c56-491b-87d5-8ae03d82c27c", "TEST_USER", "2023-05-22 22:59:30.293", "2023-05-22 23:14:01.267", "ORDERED"),
    ("9d580f51-ba68-444b-842b-1a06cf3782f8", "TEST_USER", "2023-05-22 23:14:02.107", "2023-05-22 23:14:02.107", "OPEN"),
    ("02be3bf3-7949-46db-831c-210c2f2b6066", "MaksimBashchuk", "2023-05-22 23:05:30.614", "2023-05-22 23:17:29.698", "ORDERED"),
    ("533ee956-4145-43fd-a768-0698acb6828d", "MaksimBashchuk", "2023-05-22 23:17:30.413", "2023-05-22 23:18:03.777", "ORDERED"),
    ("3fee3c25-4898-4509-aa10-0285850ff80a", "MaksimBashchuk", "2023-05-22 23:18:04.705", "2023-05-22 23:18:04.705", "OPEN"),

INSERT INTO public."CartItem"(
	id, cart_id, product_id, count)
	VALUES
    ("c204d11d-d635-402e-9253-0293b2243541", "eefab14b-1c56-491b-87d5-8ae03d82c27c", "0dcce7ec-36bf-4f5a-86ae-0a25207ab925", 1),
    ("e05d87b9-8f32-4d18-96f6-934ca9eacd8c", "02be3bf3-7949-46db-831c-210c2f2b6066", "77c54970-6158-43de-8568-802de1ee56c4", 1),
    ("1ef34d1c-ca68-4965-905b-0ff5559981ac", "02be3bf3-7949-46db-831c-210c2f2b6066", "41436932-c5cf-4d3f-b060-b23b095e1c40", 2),
    ("56247945-c4a7-4808-a9c8-86134601d040", "533ee956-4145-43fd-a768-0698acb6828d", "cae0ddbe-7023-4847-9fde-e82f04cf126c", 1);

INSERT INTO public."Order"(
	id, user_id, cart_id, payment, delivery, comments, status, total)
	VALUES
    ("e3f9821b-a5d2-4deb-a3b3-f9422d9d3292", "TEST_USER", "eefab14b-1c56-491b-87d5-8ae03d82c27c", "", "{\""firstName\"":\""last\"",\""lastName\"":\""first\"",\""address\"":\""address\"",\""comment\"":\""comment\""}", "", "OPEN", 69.989999999999990000000000000000),
    ("7b539b4f-dc96-457b-8bac-6896ee8d4d4c", "MaksimBashchuk", "02be3bf3-7949-46db-831c-210c2f2b6066", "", "{\""firstName\"":\""SURNAME\"",\""lastName\"":\""NAME\"",\""address\"":\""asdasdasd\"",\""comment\"":\""wprjgwijrgopargneporg\""}", "", "OPEN", 164.970000000000000000000000000000),
    ("ccb6a150-82c4-4d6d-863d-fe20c5064cd6", "MaksimBashchuk", "533ee956-4145-43fd-a768-0698acb6828d", "", "{\""firstName\"":\""ORDER\"",\""lastName\"":\""SECOND\"",\""address\"":\""asdfaef\"",\""comment\"":\""\""}", "", "OPEN", 69.989999999999990000000000000000);
