import { db } from "../database.ts";

export async function findById(id: number) {
	return await db
		.selectFrom("users")
		.where("id", "=", id)
		.selectAll()
		.executeTakeFirst();
}
