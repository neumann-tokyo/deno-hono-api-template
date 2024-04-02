import * as bcrypt from "bcrypt";
import { db } from "../database.ts";

export enum Languages {
	English = "en_US",
	Japanese = "ja_JP",
}

export enum Timezone {
	EuropeLondon = "Europe/London",
	AsiaTokyo = "Asia/Tokyo",
	AmericaLosAngeles = "America/Los_Angeles",
}

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
			language: language || Languages.English,
			timezone: timezone || Timezone.AsiaTokyo,
		})
		.returningAll()
		.executeTakeFirst();
}
