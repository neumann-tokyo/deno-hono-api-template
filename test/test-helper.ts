import { db } from "../src/database.ts";

export function dbTest(name, fn) {
	Deno.test(name, async (t) => {
		await fn(t);
		await db.destroy();
	});
}
