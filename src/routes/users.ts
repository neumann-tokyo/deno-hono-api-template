import { Hono } from "hono/mod.ts";
import * as modelUsers from "../models/users.ts";

const app = new Hono();

app.post("/sign-in", (c) => {
	// WIP
	// modelUsers.signIn({
	// 	email: c.body.email,
	// 	password: c.body.password,
	// });

	return c.json({ ok: true });
});

export const usersRoute = app;
