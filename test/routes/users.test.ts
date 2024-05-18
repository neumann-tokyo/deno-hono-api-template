import { afterAll, describe, it } from "deno_mocha";
import { assertEquals, assertExists } from "std/assert/mod.ts";
import { app } from "../../src/app.ts";
import { db } from "../../src/database.ts";
import { generateJwtToken } from "../../src/libs/crypto.ts";

describe("user routes", () => {
	afterAll(async () => {
		await db.destroy();
	});

	describe("POST /users/sign_in", () => {
		it("200 success", async () => {
			const res = await app.request("/users/sign_in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: "admin1@example.com",
					password: "password",
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertExists(resBody.token);
		});

		it("401 Unauthorized by invalid password", async () => {
			const res = await app.request("/users/sign_in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: "admin1@example.com",
					password: "invalid password",
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 401);
			assertExists(!resBody.user);
			assertExists(!resBody.token);
		});

		it("401 by rejected user", async () => {
			const res = await app.request("/users/sign_in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: "rejected1@example.com",
					password: "password",
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 401);
			assertExists(!resBody.user);
			assertExists(!resBody.token);
		});
	});

	describe("GET /users/me", () => {
		it("200 success", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/users/me", {
				headers: {
					Authorization: `bearer ${token}`,
				},
			});

			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.email, "admin1@example.com");
			assertEquals(resBody.displayName, "Administrator");
			assertExists(!resBody.passwordDigest);
		});
	});
});
