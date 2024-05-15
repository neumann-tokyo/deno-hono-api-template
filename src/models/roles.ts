import { db } from "../database.ts";

export async function create({
	identifier,
	displayName,
	description,
	displayOrder,
}: {
	identifier: string;
	displayName: string;
	description: string;
	displayOrder: number;
}) {
	return await db
		.insertInto("roles")
		.values({
			identifier,
			displayName,
			description,
			displayOrder,
		})
		.returningAll()
		.executeTakeFirst();
}

export async function update({
	identifier,
	displayName,
	description,
	displayOrder,
}: {
	identifier: string;
	displayName: string;
	description: string;
	displayOrder: number;
}) {
	return await db
		.updateTable("roles")
		.set({
			displayName,
			description,
			displayOrder,
			updatedAt: new Date(),
		})
		.where("identifier", "=", identifier)
		.returningAll()
		.executeTakeFirst();
}

export async function findAll() {
	return await db
		.selectFrom("roles")
		.orderBy("displayOrder")
		.selectAll()
		.orderBy("displayOrder")
		.execute();
}

export async function findByIdentifier(identifier: string) {
	const role = await db
		.selectFrom("roles")
		.where("identifier", "=", identifier)
		.selectAll()
		.executeTakeFirst();
	const permissions = await db
		.selectFrom("permissions")
		.innerJoin(
			"rolesPermissions",
			"permissions.identifier",
			"rolesPermissions.permissionIdentifier",
		)
		.where("rolesPermissions.roleIdentifier", "=", identifier)
		.selectAll("permissions")
		.orderBy("displayOrder")
		.execute();
	return { role, permissions };
}

export async function addPermission(
	roleIdentifier: string,
	permissionIdentifier: string,
) {
	const rolesPermissions = await db
		.selectFrom("rolesPermissions")
		.where("roleIdentifier", "=", roleIdentifier)
		.where("permissionIdentifier", "=", permissionIdentifier)
		.selectAll()
		.executeTakeFirst();

	if (rolesPermissions) {
		return rolesPermissions;
	}

	return await db
		.insertInto("rolesPermissions")
		.values({
			roleIdentifier,
			permissionIdentifier,
		})
		.returningAll()
		.executeTakeFirst();
}

export async function removePermission(
	roleIdentifier: string,
	permissionIdentifier: string,
) {
	return await db
		.deleteFrom("rolesPermissions")
		.where("roleIdentifier", "=", roleIdentifier)
		.where("permissionIdentifier", "=", permissionIdentifier)
		.returningAll()
		.executeTakeFirst();
}
