import { Hono } from "hono/mod.ts";
import { z } from "zod";
import type { Users } from "../database-types.ts";
import { generateJwtToken } from "../libs/crypto.ts";
import { permissionChecker } from "../middleware/permission-checker.ts";
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
		const hasSignInPermission = await modelUsers.hasPermission(
			user.id,
			"sign_in",
		);

		if (hasSignInPermission) {
			const token = await generateJwtToken({ userId: user.id });
			return c.json({ token });
		}
	}

	return c.json({ message: "Invalid email or password" }, 401);
});

app.get("/me", (c) => {
	const user = c.get("currentUser") as Users;
	const permissions = c.get("currentPermissions") as string[];
	const publicInformation = {
		id: user.id,
		displayName: user.displayName,
		email: user.email,
		language: user.language,
		timezone: user.timezone,
		datetimeFormat: user.datetimeFormat,
		permissions,
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

app.get("/", permissionChecker("management_users"), async (c) => {
	const users = await modelUsers.findAll();
	return c.json(users);
});

const updateUserRolesSchema = z.object({
	roles: z.array(z.string()),
});
app.get(
	"/:id/update_roles",
	permissionChecker("management_users"),
	async (c) => {
		const userId = c.req.param("id");
		const body = await c.req.json();
		const vResult = updateUserRolesSchema.safeParse(body);
		if (!vResult.success) {
			return c.json({ message: "Invalid request" }, 400);
		}

		const updatedUser = await modelUsers.updateRoles(
			Number(userId),
			body.roles,
		);

		return c.json(updatedUser);
	},
);

export const usersRoute = app;
