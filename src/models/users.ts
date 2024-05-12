import * as bcrypt from "bcrypt";
import { db } from "../database.ts";

export async function findById(id: number) {
	return await db
		.selectFrom("users")
		.where("id", "=", id)
		.selectAll()
		.executeTakeFirst();
}

export async function create({
	displayName,
	email,
	password,
	language,
	timezone,
}: {
	displayName: string;
	email: string;
	password: string;
	language?: string;
	timezone?: string;
}) {
	const salt = await bcrypt.genSalt(15);
	const passwordDigest = await bcrypt.hash(password, salt);

	return await db
		.insertInto("users")
		.values({
			displayName,
			email,
			passwordDigest,
			language: language || "en_US",
			timezone: timezone || "Asia/Tokyo",
		})
		.returningAll()
		.executeTakeFirst();
}

export async function update({
	id,
	displayName,
	email,
	language,
	timezone,
}: {
	id: number;
	displayName: string;
	email: string;
	language?: string;
	timezone?: string;
}) {
	return await db
		.updateTable("users")
		.set({
			displayName,
			email,
			language: language || "en_US",
			timezone: timezone || "Asia/Tokyo",
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
