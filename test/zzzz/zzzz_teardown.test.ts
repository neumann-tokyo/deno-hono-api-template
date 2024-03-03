import { db } from "../../src/database.ts";

Deno.test("teardown", async () => {
	await db.destroy();
});
