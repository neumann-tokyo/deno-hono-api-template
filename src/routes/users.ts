import { Hono } from "hono/mod.ts";
import { z } from "zod";
import type { Users } from "../database-types.ts";
import { generateJwtToken } from "../libs/crypto.ts";
import * as modelUsers from "../models/users.ts";

const app = new Hono();

const signInSchema = z.object({
	email: z.string(),
	password: z.string(),
});
app.post("/sign-in", async (c) => {
	const body = await c.req.json();
	const vResult = signInSchema.safeParse(body);

	if (vResult.success === false) {
		return c.json({ message: "Invalid email or password" }, 401);
	}

	const user = await modelUsers.signIn({
		email: body.email as string,
		password: body.password as string,
	});

	if (user) {
		const token = await generateJwtToken({ userId: user.id });
		return c.json({ user, token });
	}

	return c.json({ message: "Invalid email or password" }, 401);
});

app.get("/me", (c) => {
	//@ts-ignore: c.get is a feature of hono
	const user = c.get("currentUser") as Users;
	const publicInformation = {
		id: user.id,
		displayName: user.displayName,
		email: user.email,
		language: user.language,
		timezone: user.timezone,
	};

	return c.json(publicInformation);
});

export const usersRoute = app;
