import { Hono } from "hono/mod.ts";
import { z } from "zod";
import type { Users } from "../database-types.ts";
import { permissionChecker } from "../middleware/permission-checker.ts";
import * as modelTodos from "../models/todos.ts";

const app = new Hono();

// create a new todo for the current user
const createTodoSchema = z.object({
	title: z.string().min(1).max(200),
});
app.post("/", permissionChecker("todos"), async (c) => {
	const body = await c.req.json();
	const vResult = createTodoSchema.safeParse(body);
	if (!vResult.success) {
		return c.json({ message: "Invalid title" }, 400);
	}

	const user = c.get("currentUser") as Users;
	const todo = await modelTodos.create({
		userId: Number(user.id),
		title: body.title,
	});

	return c.json(todo);
});

// return all todos of the current user
app.get("/", permissionChecker("todos"), async (c) => {
	const user = c.get("currentUser") as Users;
	const todos = await modelTodos.findAllByUserId(Number(user.id));

	return c.json(todos);
});

// finish a todo of the current user by id
app.post("/:id/finish", permissionChecker("todos"), async (c) => {
	const todoId = c.req.param("id");
	const todo = await modelTodos.finish(Number(todoId));

	return c.json(todo);
});

export const todosRoute = app;
