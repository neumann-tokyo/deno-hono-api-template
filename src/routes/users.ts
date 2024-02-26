import { Hono } from "hono/mod.ts";

const app = new Hono();

app.post("/sign-in", async (c) => {
	return c.json({ ok: true });
});

export const usersRoute = app;
