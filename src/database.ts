import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import Pool from "pg-pool";
import type { DB } from "./database-types.ts";
import { clerk } from "./libs/clerk.ts";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString:
			Deno.env.get("DENO_ENV") === "test"
				? Deno.env.get("TEST_DB_URL")
				: Deno.env.get("DATABASE_URL"),
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	}),
});

export const db = new Kysely<DB>({
	dialect,
	plugins: [new CamelCasePlugin()],
	log: (log) => {
		if (log.level === "query") {
			clerk.info("SQL", log.query.sql);
		}
	},
});
