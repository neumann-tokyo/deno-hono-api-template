import { afterAll, beforeAll, describe, it } from "deno_mocha";
import spacetime from "spacetime";
import { assertEquals, assertExists } from "std/assert/mod.ts";
import { db } from "../../src/database.ts";
import * as modelsInvitations from "../../src/models/invitations.ts";

describe("invitations model", () => {
	let invitation;

	afterAll(async () => {
		await db.destroy();
	});

	beforeAll(async () => {
		const expiredAt = spacetime.now().add(1, "hour").format("iso");

		invitation = await modelsInvitations.create({
			expiredAt,
		});
	});

	it("create", () => {
		assertExists(invitation.identifier);
	});

	it("findAll", async () => {
		const invitations = await modelsInvitations.findAll();
		assertExists(
			invitations.find((i) => i.identifier === invitation.identifier),
		);
	});

	it("verify", async () => {
		const result = await modelsInvitations.verify(invitation.identifier);

		assertEquals(result, true);
	});
});
