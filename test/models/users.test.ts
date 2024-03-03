/// <reference types="npm:@types/mocha@^10.0.6" />

import { assertEquals } from "std/assert/mod.ts";
import * as uuid from "std/uuid/mod.ts";
import { db } from "../../src/database.ts";
import * as modelsUser from "../../src/models/users.ts";

describe("database", () => {
	after(async () => {
		await db.destroy();
	});

	it("create", async () => {
		const email = `alice-${uuid.v1.generate()}@example.com`;
		const user = await modelsUser.create({
			displayName: "Alice Poppins",
			email,
			password: "password",
		});

		assertEquals(user?.displayName, "Alice Poppins");
		assertEquals(user?.email, email);
	});

	it("findById", async () => {
		const user = await modelsUser.findById(1);

		assertEquals(user?.email, "admin1@example.com");
	});
});
