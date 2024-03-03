import { assertEquals } from "std/assert/mod.ts";
import * as uuid from "std/uuid/mod.ts";
import * as modelsUser from "../../src/models/users.ts";
import { dbTest } from "../test-helper.ts";

dbTest("create", async () => {
	const email = `alice-${uuid.v1.generate()}@example.com`;
	const user = await modelsUser.create({
		displayName: "Alice Poppins",
		email,
		password: "password",
	});

	assertEquals(user?.displayName, "Alice Poppins");
	assertEquals(user?.email, email);
});
