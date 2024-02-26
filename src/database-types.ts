import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<
	string,
	bigint | number | string,
	bigint | number | string
>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Permissions {
	created_at: Generated<Timestamp>;
	description: string | null;
	display_name: string;
	identifier: string;
	updated_at: Generated<Timestamp>;
}

export interface Roles {
	created_at: Generated<Timestamp>;
	description: string | null;
	display_name: string;
	identifier: string;
	updated_at: Generated<Timestamp>;
}

export interface RolesPermissions {
	created_at: Generated<Timestamp>;
	permission_identifier: string;
	role_identifier: string;
	updated_at: Generated<Timestamp>;
}

export interface SchemaMigrations {
	dirty: boolean;
	version: Int8;
}

export interface Users {
	created_at: Generated<Timestamp>;
	display_name: string;
	email: string;
	id: Generated<number>;
	password_digest: string;
	updated_at: Generated<Timestamp>;
}

export interface UsersRoles {
	created_at: Generated<Timestamp>;
	role_identifier: string;
	updated_at: Generated<Timestamp>;
	user_id: number;
}

export interface DB {
	permissions: Permissions;
	roles: Roles;
	roles_permissions: RolesPermissions;
	schema_migrations: SchemaMigrations;
	users: Users;
	users_roles: UsersRoles;
}
