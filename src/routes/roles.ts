import { Hono } from "hono/mod.ts";
import { z } from "zod";
import { permissionChecker } from "../middleware/permission-checker.ts";
import * as modelRoles from "../models/roles.ts";

const app = new Hono();

const createAndUpdateRoleSchema = z.object({
	identifier: z.string().min(1).max(100),
	displayName: z.string().min(1).max(100),
	description: z.string().max(500),
	displayOrder: z.number(),
});
app.post("/", permissionChecker("roles"), async (c) => {
	const body = await c.req.json();
	const vResult = createAndUpdateRoleSchema.safeParse(body);
	if (!vResult.success) {
		return c.json({ message: "Invalid role data" }, 400);
	}

	const role = await modelRoles.create({
		identifier: body.identifier,
		displayName: body.displayName,
		description: body.description,
		displayOrder: body.displayOrder,
	});

	return c.json(role);
});

app.get("/", permissionChecker("roles"), async (c) => {
	const roles = await modelRoles.findAll();
	return c.json(roles);
});

app.get("/:identifier", permissionChecker("roles"), async (c) => {
	const identifier = c.req.param("identifier");
	const roleAndPermissions = await modelRoles.findByIdentifier(identifier);
	return c.json(roleAndPermissions);
});

const addPermissionSchema = z.object({
	permissionIdentifier: z.string().min(1).max(100),
	remove: z.boolean().optional(),
});
app.post(
	"/:identifier/edit_permission",
	permissionChecker("roles"),
	async (c) => {
		const identifier = c.req.param("identifier");
		const body = await c.req.json();
		const vResult = addPermissionSchema.safeParse(body);
		if (!vResult.success) {
			return c.json({ message: "Invalid permissionIdentifier" }, 400);
		}

		if (body.remove) {
			const role = await modelRoles.removePermission(
				identifier,
				body.permissionIdentifier,
			);
			return c.json(role);
		}

		const role = await modelRoles.addPermission(
			identifier,
			body.permissionIdentifier,
		);
		return c.json(role);
	},
);

app.post("/:identifier/update", permissionChecker("roles"), async (c) => {
	const identifier = c.req.param("identifier");
	const body = await c.req.json();
	const vResult = createAndUpdateRoleSchema.safeParse({
		...body,
		identifier,
	});
	if (!vResult.success) {
		return c.json({ message: "Invalid role data" }, 400);
	}

	const role = await modelRoles.update({
		identifier,
		displayName: body.displayName,
		description: body.description,
		displayOrder: body.displayOrder,
	});

	return c.json(role);
});

export const rolesRoute = app;
