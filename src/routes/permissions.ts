import { Hono } from "hono/mod.ts";
import { permissionChecker } from "../middleware/permission-checker.ts";
import * as modelPermissions from "../models/permissions.ts";

const app = new Hono();

app.get("/", permissionChecker("roles"), async (c) => {
	const permissions = await modelPermissions.findAll();
	return c.json(permissions);
});

export const permissionsRoute = app;
