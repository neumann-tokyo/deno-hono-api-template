import { createMiddleware } from "hono/helper/factory/index.ts";

export const permissionChecker = (permissionIdentifier: string) =>
	createMiddleware(async (c, next) => {
		if (!c.get("currentPermissions").includes(permissionIdentifier)) {
			return c.json({ message: "Invalid Permissions" }, 403);
		}

		return await next();
	});
