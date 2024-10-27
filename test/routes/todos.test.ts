import { afterAll, describe, it } from "deno_mocha";
import { assertEquals, assertExists } from "std/assert/mod.ts";
import { app } from "../../src/app.ts";
import { db } from "../../src/database.ts";
import { generateJwtToken } from "../../src/libs/crypto.ts";
import * as todosModel from "../../src/models/todos.ts";

describe("todos routes", () => {
	afterAll(async () => {
		await db.destroy();
	});

	describe("POST /todos", () => {
		it("200", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					title: "test todo",
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.title, "test todo");
		});

		it("400 validation error", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					title: "t".repeat(201),
				}),
			});
			const resBody = await res.json();

			assertEquals(res.status, 400);
			assertEquals(resBody.message, "Invalid title");
		});
	});

	describe("GET /todos", () => {
		it("200", async () => {
			const todo = await todosModel.create({
				title: "test todo",
				userId: 1,
			});
			if (!todo) {
				throw new Error("Failed to create todo");
			}
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/todos", {
				method: "GET",
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			const resBody = await res.json();

			assertExists(resBody.find((t) => t.id === todo.id));
		});
	});

	describe("POST /todos/:id/finish", () => {
		it("200", async () => {
			const todo = await todosModel.create({
				title: "test todo",
				userId: 1,
			});
			if (!todo) {
				throw new Error("Failed to create todo");
			}
			assertExists(!todo.finishedAt);

			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request(`/todos/${todo.id}/finish`, {
				method: "POST",
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertExists(resBody.finishedAt);
		});
	});
});
