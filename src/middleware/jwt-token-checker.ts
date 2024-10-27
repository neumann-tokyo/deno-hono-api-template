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
		currentPermissions: string[];
	}
}

const unauthenticatedPaths = [
	"^/users/sign_in$",
	"^/users/sign_up$",
	"^/invitations/check/.*$",
];

export const jwtTokenChecker = createMiddleware(async (c, next) => {
	if (unauthenticatedPaths.some((path) => new RegExp(path).test(c.req.path))) {
		return await next();
	}

	const jwtToken = c.req.header()?.authorization?.split(" ")[1];
	if (jwtToken == null) {
		return c.json({ message: "Not Authorized" }, 401);
	}

	const payload = await verify(jwtToken, await jwtPublicKey());

	if (payload?.sub) {
		if (payload.exp) {
			const exp = spacetime(payload.exp * 1000).goto("Asia/Tokyo");
			const now = spacetime.now().goto("Asia/Tokyo");

			if (now.isBefore(exp)) {
				const { user, permissions } = await modelUsers.findByIdWithPermissions(
					Number.parseInt(payload?.sub),
				);

				if (user && permissions && permissions.includes("sign_in")) {
					c.set("currentUser", user);
					c.set("currentPermissions", permissions);
					return await next();
				}
			}
		}
	}

	return c.json({ message: "Not Authorized" }, 401);
});
