import * as bcrypt from "bcrypt";
import { db } from "../database.ts";
import { jsonArrayFrom } from "../libs/kysely-helpers.ts";

export async function findAll() {
	return await db
		.selectFrom("users")
		.selectAll()
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom("usersRoles")
					.whereRef("usersRoles.userId", "=", "users.id")
					.select(["usersRoles.roleIdentifier"]),
			).as("roles"),
		])
		.orderBy("id")
		.execute();
}

export async function findById(id: number) {
	return await db
		.selectFrom("users")
		.where("id", "=", id)
		.selectAll()
		.executeTakeFirst();
}

export async function findByIdWithPermissions(id: number) {
	const user = await db
		.selectFrom("users")
		.where("id", "=", id)
		.selectAll()
		.executeTakeFirst();
	const permissions = await db
		.selectFrom("usersRoles")
		.innerJoin(
			"rolesPermissions",
			"rolesPermissions.roleIdentifier",
			"usersRoles.roleIdentifier",
		)
		.where("usersRoles.userId", "=", id)
		.select("rolesPermissions.permissionIdentifier")
		.distinct()
		.execute();

	return { user, permissions: permissions.map((p) => p.permissionIdentifier) };
}

export async function create({
	displayName,
	email,
	password,
	language,
	timezone,
	datetimeFormat,
}: {
	displayName: string;
	email: string;
	password: string;
	language?: string;
	timezone?: string;
	datetimeFormat?: string;
}) {
	const salt = await bcrypt.genSalt(15);
	const passwordDigest = await bcrypt.hash(password, salt);

	return await db
		.insertInto("users")
		.values({
			displayName,
			email,
			passwordDigest,
			language,
			timezone,
			datetimeFormat,
		})
		.returningAll()
		.executeTakeFirst();
}

export async function update({
	id,
	displayName,
	email,
	password,
	language,
	timezone,
	datetimeFormat,
}: {
	id: number;
	displayName: string;
	email: string;
	password?: string;
	language: string;
	timezone: string;
	datetimeFormat: string;
}) {
	let passwordDigest: string | undefined;
	if (password) {
		const salt = await bcrypt.genSalt(15);
		passwordDigest = await bcrypt.hash(password, salt);
	}

	return await db
		.updateTable("users")
		.set({
			displayName,
			email,
			passwordDigest,
			language,
			timezone,
			datetimeFormat,
			updatedAt: new Date(),
		})
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst();
}

export async function signIn({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	const user = await db
		.selectFrom("users")
		.where("email", "=", email)
		.selectAll()
		.executeTakeFirst();

	if (!user) {
		return null;
	}

	const isPasswordValid = await bcrypt.compare(password, user.passwordDigest);

	if (!isPasswordValid) {
		return null;
	}

	return user;
}

export async function leave(id: number) {
	return await db.transaction().execute(async (tr) => {
		await tr.deleteFrom("usersRoles").where("userId", "=", id).execute();
		await tr
			.insertInto("usersRoles")
			.values({ userId: id, roleIdentifier: "leaved" })
			.execute();
		return await tr
			.selectFrom("users")
			.where("id", "=", id)
			.selectAll()
			.executeTakeFirst();
	});
}

export async function reject(id: number) {
	return await db.transaction().execute(async (tr) => {
		await tr.deleteFrom("usersRoles").where("userId", "=", id).execute();
		await tr
			.insertInto("usersRoles")
			.values({ userId: id, roleIdentifier: "rejected" })
			.execute();
		return await tr
			.selectFrom("users")
			.where("id", "=", id)
			.selectAll()
			.executeTakeFirst();
	});
}

export async function hasPermission(
	userId: number,
	permissionIdentifier: string,
) {
	const usersRole = await db
		.selectFrom("usersRoles")
		.innerJoin(
			"rolesPermissions",
			"rolesPermissions.roleIdentifier",
			"usersRoles.roleIdentifier",
		)
		.where("usersRoles.userId", "=", userId)
		.where("rolesPermissions.permissionIdentifier", "=", permissionIdentifier)
		.select("usersRoles.userId")
		.executeTakeFirst();

	return usersRole != null;
}

export async function addRole(userId: number, roleIdentifier: string) {
	const existing = await db
		.selectFrom("usersRoles")
		.where("userId", "=", userId)
		.where("roleIdentifier", "=", roleIdentifier)
		.selectAll()
		.executeTakeFirst();
	if (existing) {
		return existing;
	}

	return await db
		.insertInto("usersRoles")
		.values({
			userId,
			roleIdentifier,
		})
		.returningAll()
		.executeTakeFirst();
}

export async function removeRole(userId: number, roleIdentifier: string) {
	return await db
		.deleteFrom("usersRoles")
		.where("userId", "=", userId)
		.where("roleIdentifier", "=", roleIdentifier)
		.returningAll()
		.execute();
}

export async function updateRoles(userId: number, roles: string[]) {
	return await db.transaction().execute(async (tr) => {
		await tr.deleteFrom("usersRoles").where("userId", "=", userId).execute();
		if (roles.length > 0) {
			await tr
				.insertInto("usersRoles")
				.values(
					roles.flatMap((roleIdentifier) => ({
						userId,
						roleIdentifier,
					})),
				)
				.execute();
		}

		return await tr
			.selectFrom("users")
			.selectAll()
			.select((eb) => [
				jsonArrayFrom(
					eb
						.selectFrom("usersRoles")
						.whereRef("usersRoles.userId", "=", "users.id")
						.select(["usersRoles.roleIdentifier"]),
				).as("roles"),
			])
			.where("id", "=", userId)
			.executeTakeFirst();
	});
}
