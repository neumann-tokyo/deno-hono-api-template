import { Hono } from "hono/mod.ts";
import { z } from "zod";
import { permissionChecker } from "../middleware/permission-checker.ts";
import * as modelInvitations from "../models/invitations.ts";

const app = new Hono();

app.get("/", permissionChecker("invitations"), async (c) => {
	const invitations = await modelInvitations.findAll();
	return c.json(invitations);
});

const createInvitationSchema = z.object({
	expiredAt: z.string().datetime({ offset: true }).optional(),
});
app.post("/", permissionChecker("invitations"), async (c) => {
	const body = await c.req.json();
	const vResult = createInvitationSchema.safeParse(body);
	if (!vResult.success) {
		return c.json({ message: "Invalid expiredAt" }, 400);
	}

	const invitation = await modelInvitations.create({
		expiredAt: body.expiredAt,
	});
	return c.json(invitation);
});

app.post("/:identifier/delete", permissionChecker("invitations"), async (c) => {
	const identifier = c.req.param("identifier");

	const invitation = await modelInvitations.remove({
		identifier,
	});

	return c.json(invitation);
});

app.post("/check/:identifier", async (c) => {
	const identifier = c.req.param("identifier");

	if (await modelInvitations.verify(identifier)) {
		return c.json({ success: true }, 200);
	}

	return c.json({ success: false }, 200);
});

export const invitationsRoute = app;
