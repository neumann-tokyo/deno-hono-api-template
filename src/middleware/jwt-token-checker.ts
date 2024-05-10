import { verify } from "djwt";
import "hono/context.ts";
import { createMiddleware } from "hono/helper/factory/index.ts";
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
	const payload = await verify(jwtToken, await jwtPublicKey());

	if (payload?.sub) {
		// payload?.exp で有効期限のチェック
		const user = await modelUsers.findById(Number.parseInt(payload?.sub));
		c.set("currentUser", user);
	}

	return await next();
});
