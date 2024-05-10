import { afterAll, describe, it } from "deno_mocha";
import { Hono } from "hono/mod.ts";
import { assertEquals, assertExists } from "std/assert/mod.ts";
import { db } from "../../src/database.ts";
import { usersRoute } from "../../src/routes/users.ts";

const app = new Hono();
app.route("/users", usersRoute);

describe("user routes", () => {
	afterAll(async () => {
		await db.destroy();
	});

	describe("POST /users/sign-in", () => {
		it("200 success", async () => {
			const res = await app.request("/users/sign-in", {
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
			assertEquals(resBody.user.email, "admin1@example.com");
			assertEquals(resBody.user.id, 1);
			assertExists(resBody.token);
		});

		it("401 Unauthorized", async () => {
			const res = await app.request("/users/sign-in", {
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
	});
});
