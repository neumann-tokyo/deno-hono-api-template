import { verify } from "djwt";
import { createMiddleware } from "hono/helper/factory/index.ts";
import { jwtPublicKey } from "../libs/crypto.ts";

export const jwtTokenChecker = createMiddleware(async (c, next) => {
	if (c.req.path === "/users/sign-in") {
		return await next();
	}

	const jwtToken = c.req.header()?.authorization?.split(" ")[1];
	const payload = await verify(jwtToken, await jwtPublicKey());

	c.set("jwtPayload", payload);

	return await next();
});
