import { afterAll, beforeAll, describe, it } from "deno_mocha";
import spacetime from "spacetime";
import { assertEquals, assertExists, assertNotEquals } from "std/assert/mod.ts";
import { app } from "../../src/app.ts";
import { db } from "../../src/database.ts";
import { generateJwtToken } from "../../src/libs/crypto.ts";
import * as modelsInvitations from "../../src/models/invitations.ts";

describe("invitations routes", () => {
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

	describe("POST /invitations", () => {
		it("200", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const expiredAt = spacetime.now().add(1, "hour").format("iso");
			const res = await app.request("/invitations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
				body: JSON.stringify({
					expiredAt,
				}),
			});

			assertEquals(res.status, 200);

			const resBody = await res.json();
			assertExists(resBody.identifier);
			assertNotEquals(resBody.identifier, invitation.identifier);
		});
	});

	describe("GET /invitations", () => {
		it("200", async () => {
			const token = await generateJwtToken({ userId: 1 });
			const res = await app.request("/invitations", {
				method: "GET",
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertExists(resBody.find((i) => i.identifier === invitation.identifier));
		});
	});

	describe("POST /invitations/check/:identifier", () => {
		it("200 true", async () => {
			const res = await app.request(
				`/invitations/check/${invitation.identifier}`,
				{ method: "POST" },
			);
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.success, true);
		});

		it("200 true, don't have expiredAt", async () => {
			const invitationWithoutExireLimit = await modelsInvitations.create();
			const res = await app.request(
				`/invitations/check/${invitationWithoutExireLimit?.identifier}`,
				{
					method: "POST",
				},
			);
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.success, true);
		});

		it("400 false, expired", async () => {
			const expiredAt = spacetime.yesterday().format("iso");
			const expiredInvitation = await modelsInvitations.create({
				expiredAt,
			});

			const res = await app.request(
				`/invitations/check/${expiredInvitation?.identifier}`,
				{ method: "POST" },
			);
			const resBody = await res.json();

			assertEquals(res.status, 200);
			assertEquals(resBody.success, false);
		});
	});
});
