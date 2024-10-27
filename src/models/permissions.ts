import { db } from "../database.ts";

export async function findAll() {
	return await db
		.selectFrom("permissions")
		.selectAll()
		.orderBy("displayOrder")
		.execute();
}
