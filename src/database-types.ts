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

export interface Invitations {
	createdAt: Generated<Timestamp>;
	expiredAt: Timestamp | null;
	identifier: string;
	updatedAt: Generated<Timestamp>;
}

export interface Permissions {
	createdAt: Generated<Timestamp>;
	description: string | null;
	displayName: string;
	displayOrder: Generated<number>;
	identifier: string;
	updatedAt: Generated<Timestamp>;
}

export interface Roles {
	createdAt: Generated<Timestamp>;
	description: string | null;
	displayName: string;
	displayOrder: Generated<number>;
	identifier: string;
	updatedAt: Generated<Timestamp>;
}

export interface RolesPermissions {
	createdAt: Generated<Timestamp>;
	permissionIdentifier: string;
	roleIdentifier: string;
	updatedAt: Generated<Timestamp>;
}

export interface SchemaMigrations {
	dirty: boolean;
	version: Int8;
}

export interface Todos {
	createdAt: Generated<Timestamp>;
	finishedAt: Timestamp | null;
	id: Generated<number>;
	title: string;
	updatedAt: Generated<Timestamp>;
	userId: number | null;
}

export interface Users {
	createdAt: Generated<Timestamp>;
	datetimeFormat: Generated<string>;
	displayName: string;
	email: string;
	id: Generated<number>;
	language: Generated<string>;
	passwordDigest: string;
	timezone: Generated<string>;
	updatedAt: Generated<Timestamp>;
}

export interface UsersRoles {
	createdAt: Generated<Timestamp>;
	roleIdentifier: string;
	updatedAt: Generated<Timestamp>;
	userId: number;
}

export interface DB {
	invitations: Invitations;
	permissions: Permissions;
	roles: Roles;
	rolesPermissions: RolesPermissions;
	schemaMigrations: SchemaMigrations;
	todos: Todos;
	users: Users;
	usersRoles: UsersRoles;
}
