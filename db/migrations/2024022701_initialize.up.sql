begin
;


create table
  users (
    id serial primary key,
    email varchar(100) unique not null,
    password_digest varchar(100) not null,
    display_name varchar(100) not null,
    timezone varchar(100) not null default 'Asia/Tokyo',
    language varchar(100) not null default 'en_US',
    datetime_format varchar(100) not null default '{month} {date-ordinal} {year}',
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


create table
  invitations (
    identifier varchar(100) primary key,
    expired_at timestamp,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


create table
  permissions (
    identifier varchar(100) primary key,
    display_name varchar(100) not null,
    description varchar(500),
    display_order integer not null default 0,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


create table
  roles (
    identifier varchar(100) primary key,
    display_name varchar(100) not null,
    description varchar(500),
    display_order integer not null default 0,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


create table
  roles_permissions (
    role_identifier varchar(100) references roles (identifier) on delete cascade on update cascade,
    permission_identifier varchar(100) references permissions (identifier) on delete cascade on update cascade,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    primary key (role_identifier, permission_identifier)
  );


create table
  users_roles (
    user_id integer references users (id) on delete cascade on update cascade,
    role_identifier varchar(100) references roles (identifier) on delete cascade on update cascade,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    primary key (user_id, role_identifier)
  );


commit
;
