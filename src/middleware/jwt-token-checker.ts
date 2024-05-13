import { verify } from "djwt";
import "hono/context.ts";
import { createMiddleware } from "hono/helper/factory/index.ts";
import spacetime from "spacetime";
import type { Users } from "../database-types.ts";
import { jwtPublicKey } from "../libs/crypto.ts";
import * as modelUsers from "../models/users.ts";

declare module "hono/context.ts" {
	interface ContextVariableMap {
		currentUser: Users;
	}
}

export const jwtTokenChecker = createMiddleware(async (c, next) => {
	if (c.req.path === "/users/sign-in") {
		return await next();
	}

	const jwtToken = c.req.header()?.authorization?.split(" ")[1];
	console.log(jwtToken);
	if (jwtToken == null) {
		return c.json({ message: "Not Authorized" }, 401);
	}

	const payload = await verify(jwtToken, await jwtPublicKey());

	if (payload?.sub) {
		console.log("payload", payload);
		if (payload.exp) {
			const exp = spacetime(payload.exp * 1000, "Asia/Tokyo");
			const now = spacetime.now("Asia/Tokyo");

			if (now.isBefore(exp)) {
				const user = await modelUsers.findById(Number.parseInt(payload?.sub));

				if (user) {
					c.set("currentUser", user);
					return await next();
				}
			}
		}
	}

	return c.json({ message: "Not Authorized" }, 401);
});
