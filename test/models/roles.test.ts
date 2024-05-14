import { afterAll, describe, it } from "deno_mocha";
import { assertEquals, assertExists, assertNotEquals } from "std/assert/mod.ts";
import { db } from "../../src/database.ts";
import * as modelsRoles from "../../src/models/roles.ts";

describe("role model", () => {
	afterAll(async () => {
		await db.destroy();
	});

	it("create", async () => {
		const uuid = `role-${crypto.randomUUID()}`;
		const role = await modelsRoles.create({
			identifier: uuid,
			displayName: uuid,
			description: "test role",
			displayOrder: 1,
		});

		assertEquals(role?.identifier, uuid);
		assertExists(role?.createdAt);
	});

	it("update", async () => {
		const uuid = `role-${crypto.randomUUID()}`;
		let role = await modelsRoles.create({
			identifier: uuid,
			displayName: uuid,
			description: "test role",
			displayOrder: 1,
		});
		role = await modelsRoles.update({
			identifier: uuid,
			displayName: `${uuid}-updated`,
			description: "test role 2",
			displayOrder: 1,
		});

		assertEquals(role?.identifier, uuid);
		assertEquals(role?.displayName, `${uuid}-updated`);
		assertEquals(role?.description, "test role 2");
		assertNotEquals(role?.createdAt, role?.updatedAt);
	});

	it("findAll", async () => {
		const roles = await modelsRoles.findAll();

		assertExists(roles.find((r) => r.identifier === "admin"));
		assertExists(roles.find((r) => r.identifier === "general"));
		assertExists(roles.find((r) => r.identifier === "rejected"));
	});

	it("findByIdentifier", async () => {
		const { role, permissions } = await modelsRoles.findByIdentifier("admin");

		assertEquals(role?.identifier, "admin");
		assertEquals(role?.displayName, "Administrator");
		assertExists(permissions?.length > 0);
		assertExists(permissions?.find((p) => p.identifier === "sign_in"));
		assertExists(permissions?.find((p) => p.identifier === "roles"));
		assertExists(permissions?.find((p) => p.identifier === "todos"));
	});

	it("addPermission and removePermission", async () => {
		await modelsRoles.addPermission("rejected", "sign_in");

		const { permissions } = await modelsRoles.findByIdentifier("rejected");
		assertExists(permissions?.find((p) => p.identifier === "sign_in"));

		await modelsRoles.removePermission("rejected", "sign_in");
	});
});
