begin;


create table
  users(
    id serial primary key,
    email varchar(500) unique not null,
    password_digest varchar(100) not null,
    name varchar(500) not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


create table
  permissions (
    name varchar(100) primary key,
    description varchar(200),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


create table
  roles (
    name varchar(100) primary key,
    description varchar(200),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


create table
  roles_permissions (
    role_name varchar(100) references roles (name) on delete cascade on update cascade,
    permission_name varchar(100) references permissions (name) on delete cascade on update cascade,
    created_at timestamp not null default now(),
    primary key (role_name, permission_name)
  );


create table
  users_roles (
    user_id integer references users (id) on delete cascade on update cascade,
    role_name varchar(100) references roles (name) on delete cascade on update cascade,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    primary key (user_id, role_name)
  );


commit;
