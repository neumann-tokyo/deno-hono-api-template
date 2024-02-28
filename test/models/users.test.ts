import { assertEquals } from "std/assert/mod.ts";
import * as modelsUser from "../../src/models/users.ts";

// Compact form: name and function
Deno.test("findById", async () => {
	const user = await modelsUser.findById(1);

	assertEquals(user?.displayName, undefined);
});
