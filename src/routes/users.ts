import { Hono } from "hono/mod.ts";
import * as modelUsers from "../models/users.ts";

const app = new Hono();

app.post("/sign-in", async (c) => {
	const user = await modelUsers.signIn({
		email: c.body.email,
		password: c.body.password,
	});

	if (user) {
		// TODO make jwtToken
		const token = "jwtToken";
		return c.json({ user, token });
	}

	return c.status(401).json({ message: "Invalid email or password" });
});

export const usersRoute = app;
