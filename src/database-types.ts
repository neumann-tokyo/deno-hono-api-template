import type { ColumnType } from "kysely";

export type Int8 = ColumnType<
	string,
	bigint | number | string,
	bigint | number | string
>;

export interface SchemaMigrations {
	dirty: boolean;
	version: Int8;
}

export interface DB {
	schema_migrations: SchemaMigrations;
}
