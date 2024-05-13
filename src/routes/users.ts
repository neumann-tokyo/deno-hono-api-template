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
		datetimeFormat: user.datetimeFormat,
	};

	return c.json(publicInformation);
});

const meSchema = z.object({
	email: z.string().email().min(5),
	displayName: z.string().min(2).max(20),
	language: z.string().max(100),
	timezone: z.string().max(100),
	datetimeFormat: z.string().max(100),
});
app.post("/me/update", async (c) => {
	const body = await c.req.json();
	const vResult = meSchema.safeParse(body);
	const user = c.get("currentUser") as Users;

	if (vResult.success === false) {
		return c.json(vResult, 400);
	}

	const updatedUser = await modelUsers.update({
		id: Number(user.id),
		displayName: body.displayName,
		email: body.email,
		language: body.language,
		timezone: body.timezone,
		datetimeFormat: body.datetimeFormat,
	});

	return c.json({ success: true, user: updatedUser }, 200);
});

export const usersRoute = app;
