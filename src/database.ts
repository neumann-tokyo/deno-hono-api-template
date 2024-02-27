import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg-pool";
import { DB } from "./database-types.ts";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString:
			Deno.env.get("DENO_ENV") === "test"
				? Deno.env.get("TEST_DB_URL")
				: Deno.env.get("DATABASE_URL"),
	}),
});

export const db = new Kysely<DB>({
	dialect,
});
