import spacetime from "spacetime";
import { db } from "../database.ts";

export async function findAll() {
	return await db
		.selectFrom("invitations")
		.selectAll()
		.orderBy("createdAt")
		.execute();
}

export async function create({
	expiredAt,
}: {
	expiredAt?: string;
} = {}) {
	const identifier = crypto.randomUUID();

	return await db
		.insertInto("invitations")
		.values({ identifier, expiredAt })
		.returningAll()
		.executeTakeFirst();
}

export async function remove({
	identifier,
}: {
	identifier: string;
}) {
	return await db
		.deleteFrom("invitations")
		.where("identifier", "=", identifier)
		.returningAll()
		.executeTakeFirst();
}

export async function verify(identifier: string) {
	const invitation = await db
		.selectFrom("invitations")
		.where("identifier", "=", identifier)
		.selectAll()
		.executeTakeFirst();

	if (!invitation) {
		return false;
	}

	if (invitation.expiredAt == null) {
		return true;
	}

	if (invitation && spacetime(invitation.expiredAt).isAfter(spacetime.now())) {
		return true;
	}
	return false;
}
