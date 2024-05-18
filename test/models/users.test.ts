import { afterAll, describe, it } from "deno_mocha";
import { assertEquals, assertExists } from "std/assert/mod.ts";
import * as uuid from "std/uuid/mod.ts";
import { db } from "../../src/database.ts";
import * as modelsUser from "../../src/models/users.ts";

describe("user model", () => {
	afterAll(async () => {
		await db.destroy();
	});

	it("findAll", async () => {
		const users = await modelsUser.findAll();
		assertExists(users.length >= 3);
		assertEquals(users[0].email, "admin1@example.com");
		assertExists(users[0].roles.length > 0);
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

	it("signIn", async () => {
		const user = await modelsUser.signIn({
			email: "admin1@example.com",
			password: "password",
		});

		assertEquals(user?.email, "admin1@example.com");

		const invalidUser = await modelsUser.signIn({
			email: "admin1@example.com",
			password: "invalid_password",
		});

		assertExists(!invalidUser);
	});

	it("addRole and removeRole", async () => {
		assertEquals(await modelsUser.hasPermission(3, "sign_in"), false);

		await modelsUser.addRole(3, "general");
		assertEquals(await modelsUser.hasPermission(3, "sign_in"), true);

		await modelsUser.removeRole(3, "general");
		assertEquals(await modelsUser.hasPermission(3, "sign_in"), false);
	});

	it("updateRoles", async () => {
		await modelsUser.updateRoles(3, ["general"]);
		assertEquals(await modelsUser.hasPermission(3, "sign_in"), true);
		assertEquals(await modelsUser.hasPermission(3, "todos"), true);
		assertEquals(await modelsUser.hasPermission(3, "roles"), false);

		await modelsUser.updateRoles(3, ["general", "admin"]);
		assertEquals(await modelsUser.hasPermission(3, "sign_in"), true);
		assertEquals(await modelsUser.hasPermission(3, "todos"), true);
		assertEquals(await modelsUser.hasPermission(3, "roles"), true);

		await modelsUser.updateRoles(3, []);
		assertEquals(await modelsUser.hasPermission(3, "sign_in"), false);
	});
});
