import * as djwt from "djwt";
import { Hono } from "hono/mod.ts";
import * as modelUsers from "../models/users.ts";

const app = new Hono();
// TODO check if this is the correct way to generate the key
// @see https://github.com/Zaubrik/djwt/blob/master/examples/
const jwtKey = await crypto.subtle.generateKey(
	{ name: "HMAC", hash: "SHA-512" },
	true,
	["sign", "verify"],
);

app.post("/sign-in", async (c) => {
	const body = await c.req.parseBody();
	const user = await modelUsers.signIn({
		email: body.email as string,
		password: body.password as string,
	});

	if (user) {
		const token = await djwt.create(
			{
				alg: "HS512",
				typ: "JWT",
			},
			{
				sub: user.id.toString(),
				exp: djwt.getNumericDate(60 * 60 * 24 * 30),
			},
			jwtKey,
		);
		return c.json({ user, token });
	}

	return c.json({ message: "Invalid email or password" }, 401);
});

export const usersRoute = app;
