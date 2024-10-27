import { Hono } from "hono/mod.ts";
import { z } from "zod";
import type { Users } from "../database-types.ts";
import { generateJwtToken } from "../libs/crypto.ts";
import { permissionChecker } from "../middleware/permission-checker.ts";
import * as modelInvitations from "../models/invitations.ts";
import * as modelUsers from "../models/users.ts";

const app = new Hono();

const signInSchema = z.object({
	email: z.string(),
	password: z.string(),
});
app.post("/sign_in", async (c) => {
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

const signUpSchema = z.object({
	invitationIdentifier: z.string().min(1).max(100),
	email: z.string().min(3).max(100),
	password: z.string().min(8).max(50),
	displayName: z.string().min(1).max(100),
	timezone: z.string().min(1).max(100).optional(),
	language: z.string().min(1).max(100).optional(),
	datetimeFormat: z.string().min(1).max(100).optional(),
});
app.post("/sign_up", async (c) => {
	const body = await c.req.json();
	const vResult = signUpSchema.safeParse(body);

	if (vResult.success === false) {
		return c.json({ message: "Invalid user data" }, 400);
	}

	const enableInvitation = await modelInvitations.verify(
		body.invitationIdentifier,
	);

	if (!enableInvitation) {
		return c.json({ message: "Invalid invitation token" }, 400);
	}

	const user = await modelUsers.create({
		email: body.email,
		password: body.password,
		displayName: body.displayName,
		timezone: body.timezone,
		language: body.language,
		datetimeFormat: body.datetimeFormat,
	});
	if (!user) {
		return c.json({ message: "Fail to make the user" }, 400);
	}

	await modelUsers.addRole(user.id, "general");

	return c.json(user);
});

app.post("leave", async (c) => {
	const user = c.get("currentUser") as Users;
	const deletedUser = await modelUsers.leave(Number(user.id));
	return c.json(deletedUser);
});

app.post("/:id/reject", permissionChecker("users_management"), async (c) => {
	const userId = c.req.param("id");
	const deletedUser = await modelUsers.reject(Number(userId));
	return c.json(deletedUser);
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

app.get("/", permissionChecker("users_management"), async (c) => {
	const users = await modelUsers.findAll();
	return c.json(users);
});

const updateUserRolesSchema = z.object({
	roles: z.array(z.string()),
});
app.post(
	"/:id/update_roles",
	permissionChecker("users_management"),
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

const userUpdateSchema = z.object({
	email: z.string().min(3).max(100),
	password: z.string().min(8).max(50).optional(),
	displayName: z.string().min(1).max(100),
	timezone: z.string().min(1).max(100).optional(),
	language: z.string().min(1).max(100).optional(),
	datetimeFormat: z.string().min(1).max(100).optional(),
});
app.post("/:id/update", permissionChecker("users_management"), async (c) => {
	const userId = c.req.param("id");
	const body = await c.req.json();
	const vResult = userUpdateSchema.safeParse(body);
	if (!vResult.success) {
		return c.json({ message: "Invalid request" }, 400);
	}

	const updatedUser = await modelUsers.update({
		id: Number(userId),
		email: body.email,
		password: body.password || undefined,
		displayName: body.displayName,
		timezone: body.timezone,
		language: body.language,
		datetimeFormat: body.datetimeFormat,
	});
	return c.json(updatedUser);
});

export const usersRoute = app;
