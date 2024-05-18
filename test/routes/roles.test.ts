import { afterAll, describe, it } from "deno_mocha";
import { assertEquals, assertExists } from "std/assert/mod.ts";
import { app } from "../../src/app.ts";
import { db } from "../../src/database.ts";
import { generateJwtToken } from "../../src/libs/crypto.ts";
import * as modelsRoles from "../../src/models/roles.ts";

describe("roles routes", () => {
	afterAll(async () => {
		await db.destroy();
	});

	describe("GET /roles", () => {
		it("200", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/roles", {
				method: "GET",
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertExists(resBody.find((r) => r.identifier === "admin"));
			assertExists(resBody.find((r) => r.identifier === "general"));
			assertExists(resBody.find((r) => r.identifier === "rejected"));
		});
	});

	describe("GET /roles/:identifier", () => {
		it("200", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/roles/admin", {
				method: "GET",
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.role.identifier, "admin");
			assertExists(resBody.permissions.find((p) => p.identifier === "sign_in"));
			assertExists(resBody.permissions.find((p) => p.identifier === "roles"));
			assertExists(resBody.permissions.find((p) => p.identifier === "todos"));
		});
	});

	describe("POST /roles", () => {
		it("403 Forbidden", async () => {
			const token = await generateJwtToken({ userId: 2 });
			const res = await app.request("/roles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					identifier: "test",
					displayName: "Test",
					description: "Test role",
					displayOrder: 1,
				}),
			});

			assertEquals(res.status, 403);
		});

		it("200", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/roles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					identifier: "test",
					displayName: "Test",
					description: "Test role",
					displayOrder: 1,
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.identifier, "test");
			assertEquals(resBody.displayName, "Test");
			assertEquals(resBody.description, "Test role");
			assertEquals(resBody.displayOrder, 1);
		});
	});

	describe("/roles/:identifier/edit_permission", () => {
		it("200 add and remove permissions", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/roles/general/edit_permission", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					permissionIdentifier: "roles",
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.permissionIdentifier, "roles");

			// remove
			const res2 = await app.request("/roles/general/edit_permission", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					permissionIdentifier: "roles",
					remove: true,
				}),
			});

			assertEquals(res2.status, 200);
			const { permissions } = await modelsRoles.findByIdentifier("roles");
			assertExists(!permissions?.find((p) => p.identifier === "roles"));
		});
	});

	describe("/roles/:identifier/update", () => {
		it("200", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/roles/general/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					displayName: "General Updated",
					description: "General role updated",
					displayOrder: 2,
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.identifier, "general");
			assertEquals(resBody.displayName, "General Updated");
			assertEquals(resBody.description, "General role updated");
			assertEquals(resBody.displayOrder, 2);
		});
	});
});
