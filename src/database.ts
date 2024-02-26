import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg-pool";
import { Database } from "./database-types.ts"; // this is the Database interface we defined earlier

const dialect = new PostgresDialect({
	pool: new Pool({
		database: "test",
		host: "localhost",
		user: "admin",
		port: 5434,
		max: 10,
	}),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
	dialect,
});
