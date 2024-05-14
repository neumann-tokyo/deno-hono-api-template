import { db } from "../database.ts";

export async function create({
	title,
	userId,
}: {
	title: string;
	userId: number;
}) {
	return await db
		.insertInto("todos")
		.values({
			title,
			userId,
		})
		.returningAll()
		.executeTakeFirst();
}

export async function findAllByUserId(userId: number) {
	return await db
		.selectFrom("todos")
		.where("userId", "=", userId)
		.orderBy("finishedAt", "desc")
		.orderBy("createdAt", "desc")
		.selectAll()
		.execute();
}

export async function finish(todoId: number) {
	return await db
		.updateTable("todos")
		.set({
			finishedAt: new Date(),
			updatedAt: new Date(),
		})
		.where("id", "=", todoId)
		.returningAll()
		.executeTakeFirst();
}
