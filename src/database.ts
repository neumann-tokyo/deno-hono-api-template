import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import Pool from "pg-pool";
import { DB } from "./database-types.ts";

// const dialect = new PostgresDialect({
// 	pool: new Pool({
// 		connectionString:
// 			Deno.env.get("DENO_ENV") === "test"
// 				? Deno.env.get("TEST_DB_URL")
// 				: Deno.env.get("DATABASE_URL"),
// 	}),
// });

const dialect = new PostgresDialect({
	pool: new Pool({
		database: "test",
		host: "db",
		user: "postgres",
		port: 5432,
		password: "password",
		ssl: false,
		max: 10,
	}),
});

export const db = new Kysely<DB>({
	dialect,
	plugins: [new CamelCasePlugin()],
});
