import { afterAll, describe, it } from "deno_mocha";
import { assertEquals, assertExists } from "std/assert/mod.ts";
import { db } from "../../src/database.ts";
import * as modelsTodos from "../../src/models/todos.ts";

describe("todos model", () => {
	afterAll(async () => {
		await db.destroy();
	});

	describe("create", () => {
		it("success", async () => {
			const todo = await modelsTodos.create({
				title: "test todo",
				userId: 1,
			});

			assertEquals(todo?.title, "test todo");
			assertExists(todo?.id);
		});
	});

	describe("findAllByUserId", () => {
		it("success", async () => {
			await modelsTodos.create({
				title: "test todo user1",
				userId: 1,
			});
			await modelsTodos.create({
				title: "test todo user2",
				userId: 2,
			});

			const todos = await modelsTodos.findAllByUserId(1);

			assertExists(todos.find((t) => t.title === "test todo user1"));
			assertExists(!todos.find((t) => t.title === "test todo user2"));
		});
	});

	describe("finish", () => {
		it("success", async () => {
			const todo = await modelsTodos.create({
				title: "test todo",
				userId: 1,
			});
			if (!todo) {
				throw new Error("Failed to create todo");
			}
			assertExists(!todo?.finishedAt);

			const finishedTodo = await modelsTodos.finish(todo.id);

			assertExists(finishedTodo?.finishedAt);
		});
	});
});
