import * as djwt from "djwt";
import { Hono } from "hono/mod.ts";
import { algName, jwtPrivateKey } from "../libs/crypto.ts";
import * as modelUsers from "../models/users.ts";

const app = new Hono();

app.post("/sign-in", async (c) => {
	const body = await c.req.json();
	const user = await modelUsers.signIn({
		email: body.email as string,
		password: body.password as string,
	});

	if (user) {
		const token = await djwt.create(
			{
				alg: algName,
				typ: "JWT",
			},
			{
				sub: user.id.toString(),
				exp: djwt.getNumericDate(60 * 60 * 24 * 30),
			},
			await jwtPrivateKey(),
		);
		return c.json({ user, token });
	}

	return c.json({ message: "Invalid email or password" }, 401);
});

app.get("/me", async (c) => {
	const payload = c.get("jwtPayload");
	console.log(payload);

	return c.json({ ok: true });
});

export const usersRoute = app;
